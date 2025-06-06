import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/ui/PromptCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { TabsList } from "@/components/ui/TabsList";
import { TabItem } from "@/types";
import { Role, Task } from "@/types";
import { 
  prompts, 
  getRolePrompts, 
  getTaskPrompts, 
  getAllRoles, 
  getAllTasks,
  searchPrompts
} from "@/data/prompts";
import Sidebar from "@/components/layout/Sidebar";
import AnalyticsView from "@/components/analytics/AnalyticsView";

interface DashboardProps {
  mode?: "roles" | "tasks" | "analytics" | "settings";
  category?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { mode = "roles", category } = useParams<{ 
    mode?: string; 
    category?: string 
  }>();

  const isMobile = useIsMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filteredPrompts, setFilteredPrompts] = useState(prompts);
  const [activeTab, setActiveTab] = useState<string>(category || getAllRoles()[0].toLowerCase());
  
  // Generate tabs based on current mode
  const tabs: TabItem[] = mode === "roles"
    ? getAllRoles().map(role => ({
        id: role,
        label: role,
        value: role.toLowerCase(),
        count: getRolePrompts(role as Role).length
      }))
    : getAllTasks().map(task => ({
        id: task,
        label: task,
        value: task.toLowerCase(),
        count: getTaskPrompts(task as Task).length
      }));
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard/${mode}/${value}`);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      // If search is cleared, show prompts for active tab
      const currentTab = activeTab.charAt(0).toUpperCase() + activeTab.slice(1) as Role | Task;
      if (mode === "roles") {
        setFilteredPrompts(getRolePrompts(currentTab as Role));
      } else {
        setFilteredPrompts(getTaskPrompts(currentTab as Task));
      }
    } else {
      // Filter prompts based on search query
      setFilteredPrompts(searchPrompts(query));
    }
  };
  
  // Update filtered prompts when tab changes
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      return; // Don't update if there's an active search
    }
    
    const currentTab = activeTab.charAt(0).toUpperCase() + activeTab.slice(1) as Role | Task;
    
    if (mode === "roles") {
      setFilteredPrompts(getRolePrompts(currentTab as Role));
    } else if (mode === "tasks") {
      setFilteredPrompts(getTaskPrompts(currentTab as Task));
    }
  }, [activeTab, mode, searchQuery]);
  
  // Set activeTab based on URL params
  useEffect(() => {
    if (category) {
      setActiveTab(category);
    } else {
      // Set default tab if no category in URL
      if (mode === "roles") {
        const defaultRole = getAllRoles()[0].toLowerCase();
        setActiveTab(defaultRole);
        navigate(`/dashboard/${mode}/${defaultRole}`);
      } else if (mode === "tasks") {
        const defaultTask = getAllTasks()[0].toLowerCase();
        setActiveTab(defaultTask);
        navigate(`/dashboard/${mode}/${defaultTask}`);
      }
    }
  }, [mode, category, navigate]);
  
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
                
                <h1 className="text-xl font-semibold">
                  {mode === "roles" && "Roles"}
                  {mode === "tasks" && "Tasks"}
                  {mode === "analytics" && "Analytics"}
                  {mode === "settings" && "Settings"}
                </h1>
              </div>
              
              <div className="flex items-center">
                <SearchBar 
                  onSearch={handleSearch} 
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          {mode === "analytics" ? (
            <AnalyticsView />
          ) : mode === "settings" ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">
                  Configure your dashboard preferences and account settings.
                </p>
              </div>
              
              <div className="max-w-2xl">
                <div className="space-y-6">
                  <div className="rounded-lg border border-border p-6">
                    <h2 className="text-lg font-medium mb-4">Appearance</h2>
                    <p className="text-muted-foreground mb-4">
                      Customize how the dashboard looks and feels.
                    </p>
                    <div className="space-y-4">
                      {/* Placeholder settings options */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Theme</h3>
                          <p className="text-xs text-muted-foreground">
                            Choose between light and dark mode
                          </p>
                        </div>
                        <Button variant="outline">Light</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Card Display</h3>
                          <p className="text-xs text-muted-foreground">
                            Choose how prompt cards are displayed
                          </p>
                        </div>
                        <Button variant="outline">Grid</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-border p-6">
                    <h2 className="text-lg font-medium mb-4">Preferences</h2>
                    <p className="text-muted-foreground mb-4">
                      Manage your dashboard preferences and defaults.
                    </p>
                    <div className="space-y-4">
                      {/* Placeholder preferences options */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Default View</h3>
                          <p className="text-xs text-muted-foreground">
                            Choose which view loads by default
                          </p>
                        </div>
                        <Button variant="outline">Roles</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Show Statistics</h3>
                          <p className="text-xs text-muted-foreground">
                            Show prompt usage statistics
                          </p>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Show tabs navigation for roles and tasks */}
              {tabs.length > 0 && (
                <TabsList
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              )}
              
              {/* Prompt grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt, index) => (
                  <PromptCard key={prompt.id} prompt={prompt} index={index} />
                ))}
              </div>
              
              {/* Empty state */}
              {filteredPrompts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    No prompts found for the current selection.
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      handleSearch("");
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
