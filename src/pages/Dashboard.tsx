
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import PromptForm from "@/components/prompts/PromptForm";
import PromptList from "@/components/prompts/PromptList";
import UserAnalytics from "@/components/analytics/UserAnalytics";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const isMobile = useIsMobile();

  // get route params
  const { mode, category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = !user;

  const handlePromptCreated = () => setRefreshFlag(f => !f);

  // handle role/task filtering
  let byRole: string | undefined;
  let byTask: string | undefined;
  if (mode === "roles" && category) {
    byRole = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  } else if (mode === "tasks" && category) {
    byTask = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  // Determine if on the main dashboard view (no filtering)
  const isMainDashboardView = !mode && !category;
  // Hide add prompt in analytics view (route = "/dashboard/analytics")
  const isAnalyticsView =
    location.pathname.startsWith("/dashboard/analytics") ||
    (mode === "analytics" && !category);

  // For guests, do not show analytics
  const showAnalytics = user && (isMainDashboardView || isAnalyticsView);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <main className="flex-1 pb-12">
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          {/* PROMPT LIST:
              - Guest: only limited prompts, no filtering, no add, no analytics.
              - Auth: full functionality. */}
          <PromptList
            refreshFlag={refreshFlag}
            byRole={user ? byRole : undefined}
            byTask={user ? byTask : undefined}
            showAddPrompt={!!user && !isAnalyticsView}
            onPromptCreated={handlePromptCreated}
          />
          {/* Only show analytics for authenticated users */}
          {showAnalytics && <UserAnalytics />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
