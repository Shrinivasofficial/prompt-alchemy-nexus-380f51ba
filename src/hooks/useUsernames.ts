
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
        setUsernames(map);
      }
    }
    fetchUsernames();
  }, [JSON.stringify(userIds)]);
  return usernames;
}
