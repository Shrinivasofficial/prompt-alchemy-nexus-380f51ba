
// Fixed for missing generated Supabase types

import { supabase } from "@/integrations/supabase/client";
import { PromptDB, PromptRatingDB, PromptViewDB, ViewPromptAnalytics } from "@/types";

// Fetch all prompts, sorted recent first
export const fetchPrompts = async (): Promise<PromptDB[]> => {
  const { data, error } = await (supabase as any)
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as PromptDB[];
};

// Add a new prompt
export const createPrompt = async (prompt: Omit<PromptDB, "id" | "created_by" | "created_at" | "views" | "avg_rating" | "ratings_count">, userId: string) => {
  const { data, error } = await (supabase as any)
    .from("prompts")
    .insert([{ ...prompt, created_by: userId }])
    .select()
    .single();

  if (error) throw error;
  return data as PromptDB;
};

// Rate a prompt (upsert for the user/prompt combination)
export const ratePrompt = async (prompt_id: string, user_id: string, rating: number) => {
  const { data, error } = await (supabase as any)
    .from("prompt_ratings")
    .upsert([{ prompt_id, user_id, rating }], { onConflict: "prompt_id,user_id" })
    .select()
    .single();
  if (error) throw error;
  return data as PromptRatingDB;
};

// Fetch current user's rating for a prompt
export const getUserPromptRating = async (prompt_id: string, user_id: string) => {
  const { data } = await (supabase as any)
    .from("prompt_ratings")
    .select("*")
    .eq("prompt_id", prompt_id)
    .eq("user_id", user_id)
    .maybeSingle();
  return data as PromptRatingDB | null;
};

// Log prompt copy/view action
export const logPromptCopy = async (prompt_id: string, user_id: string) => {
  await (supabase as any).from("prompt_views").insert([
    { prompt_id, user_id, copied: true }
  ]);
};

// Fetch prompt analytics for a user
export const fetchUserAnalytics = async (user_id: string) => {
  // prompts contributed
  const { count: contributedCount } = await (supabase as any)
    .from("prompts")
    .select("id", { count: "exact", head: true })
    .eq("created_by", user_id);

  // prompt copies/views by user
  const { data: viewsData } = await (supabase as any)
    .from("prompt_views")
    .select("prompt_id, copied")
    .eq("user_id", user_id);

  // stats for prompts contributed
  const { data: promptStats } = await (supabase as any)
    .from("view_prompt_analytics")
    .select("*");

  return {
    contributedCount: contributedCount || 0,
    viewsData: viewsData || [],
    promptStats: promptStats || []
  }
};

// Fetch the public aggregate analytics view for prompts
export const fetchPromptAnalytics = async (): Promise<ViewPromptAnalytics[]> => {
  const { data } = await (supabase as any)
    .from("view_prompt_analytics")
    .select("*");
  return (data || []) as ViewPromptAnalytics[];
};
