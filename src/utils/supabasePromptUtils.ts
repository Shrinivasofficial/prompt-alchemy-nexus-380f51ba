// Fixed for missing generated Supabase types

import { supabase } from "@/integrations/supabase/client";
import { PromptDB, PromptRatingDB, PromptViewDB, ViewPromptAnalytics } from "@/types";

// Fetch all prompts, sorted recent first
// Add filter parameter (byRole/byTask) with filterValue
export const fetchPrompts = async (options?: { byRole?: string; byTask?: string }): Promise<PromptDB[]> => {
  let query = (supabase as any)
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.byRole) {
    query = query.contains("roles", [options.byRole]);
  }
  if (options?.byTask) {
    query = query.contains("tasks", [options.byTask]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as PromptDB[];
};

// Add a new prompt
export const createPrompt = async (
  prompt: Omit<PromptDB, "id" | "created_by" | "created_at" | "views" | "avg_rating" | "ratings_count"> & { sample_output?: string | null },
  userUuid: string
) => {
  const { data, error } = await (supabase as any)
    .from("prompts")
    .insert([{ ...prompt, created_by: userUuid }])
    .select()
    .single();

  if (error) throw error;
  return data as PromptDB;
};

// Rate a prompt (upsert for the user/prompt combination) - NOW uses uuid
export const ratePrompt = async (prompt_id: string, user_id: string, rating: number, prompt_owner_id?: string) => {
  if (prompt_owner_id && prompt_owner_id === user_id) {
    // Do not allow user to rate own prompt
    return null;
  }
  const { data, error } = await (supabase as any)
    .from("prompt_ratings")
    .upsert([{ prompt_id, user_id, rating }], { onConflict: "prompt_id,user_id" })
    .select()
    .single();
  if (error) throw error;
  return data as PromptRatingDB;
};

// Fetch current user's rating for a prompt (by uuid)
export const getUserPromptRating = async (prompt_id: string, user_id: string) => {
  const { data } = await (supabase as any)
    .from("prompt_ratings")
    .select("*")
    .eq("prompt_id", prompt_id)
    .eq("user_id", user_id)
    .maybeSingle();
  return data as PromptRatingDB | null;
};

// Log prompt copy/view action (by uuid)
export const logPromptCopy = async (prompt_id: string, user_id: string, prompt_owner_id?: string) => {
  if (prompt_owner_id && prompt_owner_id === user_id) {
    // Do not log copy if by owner
    return;
  }
  await (supabase as any).from("prompt_views").insert([
    { prompt_id, user_id, copied: true }
  ]);
};

// Fetch prompt analytics for a user (by uuid)
export const fetchUserAnalytics = async (user_id: string) => {
  // get prompts contributed by user
  const { data: contributedPrompts, count: contributedCount } = await (supabase as any)
    .from("prompts")
    .select("id", { count: "exact", head: false })
    .eq("created_by", user_id);

  const contributedPromptIds = (contributedPrompts || []).map((p: any) => p.id);

  // prompt copies/views by user (their own activity)
  const { data: viewsData } = await (supabase as any)
    .from("prompt_views")
    .select("prompt_id, copied, rating, created_at")
    .eq("user_id", user_id);

  // stats for all prompts (aggregate)
  const { data: promptStats } = await (supabase as any)
    .from("view_prompt_analytics")
    .select("*");

  return {
    contributedCount: contributedCount || 0,
    contributedPromptIds,
    viewsData: viewsData || [],
    promptStats: promptStats || [],
  }
};

// Fetch the public aggregate analytics view for prompts
export const fetchPromptAnalytics = async (): Promise<ViewPromptAnalytics[]> => {
  const { data } = await (supabase as any)
    .from("view_prompt_analytics")
    .select("*");
  return (data || []) as ViewPromptAnalytics[];
};

// Delete a prompt by id
export const deletePrompt = async (prompt_id: string) => {
  const { error } = await (supabase as any)
    .from("prompts")
    .delete()
    .eq("id", prompt_id);
  if (error) throw error;
  return true;
};
