
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EnsureProfileOpts {
  user: { id: string; email: string } | null;
  username?: string;
}

/**
 * Ensures that the current user's profile exists and is up to date.
 * Runs on mount/user change: upserts { id, email, username }.
 */
export function useEnsureProfile({ user, username }: EnsureProfileOpts) {
  useEffect(() => {
    if (!user) return;
    // Default username: prefix of email (fallback)
    const fallbackUsername =
      username ||
      (user.email ? user.email.split("@")[0] : "user");
    // Upsert profile
    supabase
      .from("profiles")
      .upsert(
        [
          {
            id: user.id,
            email: user.email,
            username: fallbackUsername,
          },
        ],
        { onConflict: "id" }
      )
      .then(({ error }) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.warn("Failed to upsert profile info:", error.message);
        }
      });
  }, [user?.id, user?.email, username]);
}
