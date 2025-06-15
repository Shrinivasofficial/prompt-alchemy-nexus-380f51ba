
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAnalytics } from "@/utils/supabasePromptUtils";
import { Card } from "@/components/ui/card";
import { BarChart } from "lucide-react";

const UserAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetchUserAnalytics(user.email).then(data => setStats(data));
  }, [user]);

  if (!user) return null;
  if (!stats) return <div>Loading analytics...</div>;

  // Analytics: total prompts contributed, copied, etc.
  const totalContributed = stats.contributedCount;
  const copies = stats.viewsData.filter((v: any) => v.copied).length;

  return (
    <Card className="p-6 mb-6 flex flex-col gap-4 border">
      <div className="flex items-center gap-2 mb-2">
        <BarChart className="text-primary" />
        <h2 className="text-xl font-semibold">Your Analytics</h2>
      </div>
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-lg font-bold">{totalContributed}</div>
          <div className="text-xs text-muted-foreground">Prompts Contributed</div>
        </div>
        <div>
          <div className="text-lg font-bold">{copies}</div>
          <div className="text-xs text-muted-foreground">Prompts Copied</div>
        </div>
      </div>
      {/* For brevity, add more analytics here as needed */}
    </Card>
  );
};

export default UserAnalytics;
