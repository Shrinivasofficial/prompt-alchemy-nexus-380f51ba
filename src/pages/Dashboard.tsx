
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PromptForm from "@/components/prompts/PromptForm";
import PromptList from "@/components/prompts/PromptList";
import UserAnalytics from "@/components/analytics/UserAnalytics";

const Dashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const isMobile = useIsMobile();

  // After prompt creation, trigger refresh
  const handlePromptCreated = () => setRefreshFlag(f => !f);

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
          {/* Prompt creation form; only show for signed-in users */}
          <PromptForm onPromptCreated={handlePromptCreated} />
          {/* Personalized analytics */}
          <UserAnalytics />
          {/* Prompt list from Supabase */}
          <PromptList refreshFlag={refreshFlag} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
