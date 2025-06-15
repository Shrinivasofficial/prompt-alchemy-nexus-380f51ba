
import React, { useEffect, useState } from "react";
import { fetchPrompts, fetchPromptAnalytics } from "@/utils/supabasePromptUtils";
import { PromptCard } from "@/components/ui/PromptCard";
import { ViewPromptAnalytics } from "@/types";
import PromptForm from "./PromptForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsernames } from "@/hooks/useUsernames";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface PromptListProps {
  refreshFlag: boolean;
  byRole?: string;
  byTask?: string;
  showAddPrompt?: boolean;
  onPromptCreated?: () => void;
}

const GUEST_PROMPT_LIMIT = 3;

const PromptList: React.FC<PromptListProps> = ({
  refreshFlag,
  byRole,
  byTask,
  showAddPrompt = false,
  onPromptCreated
}) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, ViewPromptAnalytics>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuest = !user;

  // Pull all unique user ids from loaded prompts for username display
  const userIds = prompts
    .map((p) => p.created_by)
    .filter((v, i, arr) => !!v && arr.indexOf(v) === i);

  // Fetch usernames corresponding to created_by
  const usernames = useUsernames(userIds);

  // Fetch data
  const fetchAll = () => {
    setLoading(true);
    Promise.all([fetchPrompts({ byRole, byTask }), fetchPromptAnalytics()])
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
  }, [refreshFlag, byRole, byTask]);

  // For guests, restrict prompts and disable filtering
  useEffect(() => {
    // If not authenticated, but asked for tasks/roles filtering, redirect to signin
    if (isGuest && (byRole || byTask)) {
      navigate("/signin", { replace: true });
    }
  }, [isGuest, byRole, byTask, navigate]);

  if (loading) return <div>Loading prompts...</div>;

  // Guest prompt list: limit
  const visiblePrompts = isGuest ? prompts.slice(0, GUEST_PROMPT_LIMIT) : prompts;

  return (
    <div className="relative">
      {/* Add Prompt: Only enabled for authenticated users */}
      {showAddPrompt && !isGuest && (
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
          <DialogContent className="max-w-2xl w-full p-0 bg-background">
            <div className="py-6 px-6">
              <PromptForm
                onPromptCreated={() => {
                  setShowForm(false);
                  fetchAll();
                  if (onPromptCreated) onPromptCreated(); // refresh parent
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Title, always visible */}
      <div className="flex items-center justify-between mb-6 mt-4">
        <h2 className="text-xl font-bold">
          {isGuest ? "Featured Prompts (Sign in to unlock more!)" : "All Prompts"}
        </h2>
      </div>
      {/* Prompts feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {visiblePrompts.map((prompt, idx) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            analytics={analytics[prompt.id]}
            index={idx}
            username={usernames[prompt.created_by]}
          />
        ))}
        {visiblePrompts.length === 0 && (
          <div className="col-span-3 text-muted-foreground py-8 text-center">No prompts found.</div>
        )}
      </div>
      {/* For guests: "Show more" button that routes to signin */}
      {isGuest && prompts.length > GUEST_PROMPT_LIMIT && (
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/signin")}
            className="animate-fade-in"
          >
            Sign in to unlock all prompts!
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromptList;
