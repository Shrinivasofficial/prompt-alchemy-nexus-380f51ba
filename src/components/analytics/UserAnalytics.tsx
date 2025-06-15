
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAnalytics, fetchPrompts } from "@/utils/supabasePromptUtils";
import { Card } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { PromptCard } from "@/components/ui/PromptCard";

const UserAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentlyRatedPrompts, setRecentlyRatedPrompts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchUserAnalytics(user.id).then(data => {
      setStats(data);

      // Extract recently rated prompt_ids (sorted by latest)
      const ratings = (data.viewsData || [])
        .filter((v: any) => v.copied === false && v.prompt_id && v.rating)
        .sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0))
        .slice(0, 5);

      if (ratings.length > 0) {
        fetchPrompts().then(prompts => {
          const recentPrompts = prompts.filter((p: any) =>
            ratings.some((r: any) => r.prompt_id === p.id)
          );
          setRecentlyRatedPrompts(recentPrompts);
        });
      }
    });
  }, [user]);

  if (!user) return null;
  if (!stats) return <div>Loading analytics...</div>;

  // Compute aggregates for the user's contributed prompts
  const promptStatsOwned = (stats.promptStats || []).filter(
    (s: any) =>
      stats.contributedPromptIds && stats.contributedPromptIds.includes(s.prompt_id)
  );

  const totalContributed = stats.contributedCount || 0;
  const totalCopies = promptStatsOwned.reduce(
    (sum: number, stat: any) => sum + (stat.total_copies || 0),
    0
  );
  const totalViews = promptStatsOwned.reduce(
    (sum: number, stat: any) => sum + (stat.total_views || 0),
    0
  );
  const totalRatings = promptStatsOwned.reduce(
    (sum: number, stat: any) => sum + (stat.ratings_count || 0),
    0
  );
  const avgRating =
    promptStatsOwned.length > 0
      ? (
          promptStatsOwned.reduce(
            (sum: number, stat: any) =>
              sum + ((Number(stat.avg_rating) || 0) * (Number(stat.ratings_count) || 0)),
            0
          ) / Math.max(1, totalRatings)
        ).toFixed(2)
      : "0.00";

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
          <div className="text-lg font-bold">{totalCopies}</div>
          <div className="text-xs text-muted-foreground">Copies of Your Prompts</div>
        </div>
        <div>
          <div className="text-lg font-bold">{totalViews}</div>
          <div className="text-xs text-muted-foreground">Views of Your Prompts</div>
        </div>
        <div>
          <div className="text-lg font-bold">{avgRating}</div>
          <div className="text-xs text-muted-foreground">Avg. Rating (Your Prompts)</div>
        </div>
        <div>
          <div className="text-lg font-bold">{totalRatings}</div>
          <div className="text-xs text-muted-foreground"># Ratings (Your Prompts)</div>
        </div>
      </div>

      {/* Recent Rated Prompts */}
      {recentlyRatedPrompts.length > 0 && (
        <div className="mt-6">
          <div className="text-md font-semibold mb-3">Prompts You've Recently Rated</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentlyRatedPrompts.map((prompt, idx) => (
              <PromptCard key={prompt.id} prompt={prompt} analytics={null} index={idx} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserAnalytics;
