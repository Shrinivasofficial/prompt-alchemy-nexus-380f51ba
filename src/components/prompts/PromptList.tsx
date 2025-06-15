
import React, { useEffect, useState } from "react";
import { fetchPrompts, fetchPromptAnalytics } from "@/utils/supabasePromptUtils";
import { PromptCard } from "@/components/ui/PromptCard";
import { ViewPromptAnalytics } from "@/types";

const PromptList: React.FC<{ refreshFlag: boolean }> = ({ refreshFlag }) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, ViewPromptAnalytics>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPrompts(), fetchPromptAnalytics()]).then(([promptsData, analyticsData]) => {
      setPrompts(promptsData);
      const analyticsMap: Record<string, ViewPromptAnalytics> = {};
      analyticsData.forEach(item => { analyticsMap[item.prompt_id] = item });
      setAnalytics(analyticsMap);
    }).finally(() => setLoading(false));
  }, [refreshFlag]);

  if (loading) return <div>Loading prompts...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {prompts.map((prompt, idx) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          analytics={analytics[prompt.id]}
          index={idx}
        />
      ))}
      {prompts.length === 0 && (
        <div className="col-span-3 text-muted-foreground py-8 text-center">No prompts found.</div>
      )}
    </div>
  );
};

export default PromptList;
