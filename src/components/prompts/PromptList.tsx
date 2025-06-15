
import React, { useEffect, useState } from "react";
import { fetchPrompts, fetchPromptAnalytics } from "@/utils/supabasePromptUtils";
import { PromptCard } from "@/components/ui/PromptCard";
import { ViewPromptAnalytics } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PromptForm from "./PromptForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const PromptList: React.FC<{ refreshFlag: boolean }> = ({ refreshFlag }) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, ViewPromptAnalytics>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">All Prompts</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <PromptForm
              onPromptCreated={() => setShowForm(false)}
              postSubmitCallback={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
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
    </div>
  );
};

export default PromptList;
