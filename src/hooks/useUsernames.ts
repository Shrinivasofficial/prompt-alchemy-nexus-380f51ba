import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fetch usernames for an array of user IDs
export function useUsernames(userIds: string[] = []) {
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  useEffect(() => {
    async function fetchUsernames() {
      if (userIds.length === 0) {
        setUsernames({});
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (!error && data) {
        const map: Record<string, string> = {};
        for (const row of data) {
          map[row.id] = row.username;
        }
        // Add fallback: any id not in map gets "Unknown user"
        for (const id of userIds) {
          if (!map[id]) map[id] = "Unknown user";
        }
        setUsernames(map);
        // eslint-disable-next-line no-console
        console.log("[useUsernames] loaded usernames:", map, "for userIds:", userIds, "raw data:", data);
      } else if (error) {
        // eslint-disable-next-line no-console
        console.warn("[useUsernames] error loading usernames:", error.message);
        // fallback: all requested ids to Unknown user
        const map: Record<string, string> = {};
        for (const id of userIds) map[id] = "Unknown user";
        setUsernames(map);
      }
    }
    fetchUsernames();
    // eslint-disable-next-line
  }, [JSON.stringify(userIds)]);
  return usernames;
}
