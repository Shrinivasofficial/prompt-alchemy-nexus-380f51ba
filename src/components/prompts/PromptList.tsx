
import React, { useEffect, useState } from "react";
import { fetchPrompts, fetchPromptAnalytics } from "@/utils/supabasePromptUtils";
import { PromptCard } from "@/components/ui/PromptCard";
import { ViewPromptAnalytics } from "@/types";
import PromptForm from "./PromptForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PromptList: React.FC<{ refreshFlag: boolean }> = ({ refreshFlag }) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, ViewPromptAnalytics>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Refetch data if prompt was added
  const fetchAll = () => {
    setLoading(true);
    Promise.all([fetchPrompts(), fetchPromptAnalytics()])
      .then(([promptsData, analyticsData]) => {
        setPrompts(promptsData);
        const analyticsMap: Record<string, ViewPromptAnalytics> = {};
        analyticsData.forEach((item) => {
          analyticsMap[item.prompt_id] = item;
        });
        setAnalytics(analyticsMap);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [refreshFlag]);

  // Show loading at start
  if (loading) return <div>Loading prompts...</div>;

  return (
    <div className="relative">
      {/* Floating Add Prompt Button */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="fixed z-40 right-6 top-6 md:right-10 md:top-10 shadow-lg gap-2"
            style={{ borderRadius: "9999px", boxShadow: "0 2px 16px 0 #0002" }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Prompt</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <PromptForm
            onPromptCreated={() => {
              setShowForm(false);
              fetchAll();
            }}
          />
        </DialogContent>
      </Dialog>
      {/* Title, always visible */}
      <div className="flex items-center justify-between mb-6 mt-4">
        <h2 className="text-xl font-bold">All Prompts</h2>
      </div>
      {/* Prompts feed */}
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
