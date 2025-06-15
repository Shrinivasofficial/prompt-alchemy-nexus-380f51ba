import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EnsureProfileOpts {
  user: { id: string; email: string } | null;
  username?: string;
}

/**
 * Ensures that the current user's profile exists and is up to date.
 * - Only updates the username if one is explicitly passed.
 * - Does not override an existing username with a fallback.
 */
export function useEnsureProfile({ user, username }: EnsureProfileOpts) {
  useEffect(() => {
    if (!user) return;
    // Only upsert if username is actually being provided
    if (username) {
      supabase
        .from("profiles")
        .upsert(
          [
            {
              id: user.id,
              email: user.email,
              username: username,
            },
          ],
          { onConflict: "id" }
        )
        .then(({ error, data }) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.warn("Failed to upsert profile info:", error.message);
          } else {
            // eslint-disable-next-line no-console
            console.log(
              "[useEnsureProfile] Upserted/ensured profile:",
              data,
              "user:", user,
              "username used:", username
            );
          }
        });
    }
    // Otherwise, do not upsert or override data
  }, [user?.id, user?.email, username]);
}
