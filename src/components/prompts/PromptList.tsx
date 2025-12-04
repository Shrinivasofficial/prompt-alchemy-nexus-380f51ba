import React, { useEffect, useState } from "react";
import { fetchPrompts, fetchPromptAnalytics } from "@/utils/supabasePromptUtils";
import { PromptCard } from "@/components/ui/PromptCard";
import { ViewPromptAnalytics } from "@/types";
import PromptForm from "./PromptForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";
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
const PAGE_SIZE = 9; // adjust if needed

const PromptList: React.FC<PromptListProps> = ({
  refreshFlag,
  byRole,
  byTask,
  showAddPrompt = false,
  onPromptCreated,
}) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, ViewPromptAnalytics>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuest = !user;

  // Unique created_by ids for username lookup
  const userIds = [...new Set(prompts.map((p) => p.created_by).filter(Boolean))];
  const usernames = useUsernames(userIds);

  // Fetch prompts + analytics
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag, byRole, byTask]);

  // Guests cannot use role/task filtered views
  useEffect(() => {
    if (isGuest && (byRole || byTask)) {
      navigate("/signin", { replace: true });
    }
  }, [isGuest, byRole, byTask, navigate]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter/search changes
  useEffect(() => {
    setPage(1);
  }, [byRole, byTask, debouncedQuery]);

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading prompts...
      </div>
    );
  }

  // --------- SEARCH: TITLE ONLY ----------
  let filteredPrompts = prompts;

  if (debouncedQuery) {
    const q = debouncedQuery.toLowerCase();
    filteredPrompts = prompts.filter((p) =>
      (p.title ?? "").toLowerCase().includes(q)
    );
  }

  // --------- PAGINATION ----------
  const totalPrompts = filteredPrompts.length;
  const totalPages = Math.max(1, Math.ceil(totalPrompts / PAGE_SIZE));

  let visiblePrompts: any[] = [];
  let startIndex = 0;
  let endIndex = 0;

  if (isGuest) {
    visiblePrompts = filteredPrompts.slice(0, GUEST_PROMPT_LIMIT);
  } else {
    startIndex = (page - 1) * PAGE_SIZE;
    endIndex = Math.min(startIndex + PAGE_SIZE, totalPrompts);
    visiblePrompts = filteredPrompts.slice(startIndex, endIndex);
  }

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="relative">
      {/* Floating Add Prompt button – top-right */}
      {showAddPrompt && !isGuest && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="fixed z-40 right-6 top-6 md:right-10 md:top-10 shadow-lg gap-2 rounded-full"
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
                  onPromptCreated?.();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ============== TOP: CENTERED SEARCH BAR ============== */}
     

      {/* Optional centered heading + count */}
     <div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold">
    {isGuest ? "Featured Prompts" : "All Prompts"}
  </h2>


</div>
 <div className="mt-6 mb-3 flex justify-center">
  <div className="w-full mx-5"> 
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search prompts by title..."
        className="pl-9 pr-8 w-full"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  </div>
</div>


      {/* GRID OF CARDS */}
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
      </div>

      {/* EMPTY STATE */}
      {visiblePrompts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {debouncedQuery
            ? `No prompts found with title matching “${debouncedQuery}”.`
            : "No prompts found."}
        </div>
      )}

      {/* Guest CTA */}
      {isGuest && filteredPrompts.length > GUEST_PROMPT_LIMIT && (
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

      {/* ============== BOTTOM: CENTERED PAGINATION ============== */}
      {!isGuest && totalPages > 1 && (
        <div className="mt-4 mb-10 flex flex-col items-center gap-2">
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptList;
