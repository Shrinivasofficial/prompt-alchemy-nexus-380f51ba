
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role, Task, getRolesWithCount, getTasksWithCount } from "@/data/prompts";
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const [activeCategory, setActiveCategory] = useState<"roles" | "tasks" | null>(null);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const roles = getRolesWithCount();
  const tasks = getTasksWithCount();
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 border-r border-border bg-sidebar transition-transform duration-300 ease-in-out",
          "flex flex-col gap-1 p-4",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-semibold">PromptNexus</h1>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileOpen(false)} 
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/dashboard") || location.pathname.startsWith("/dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>
        
        <div className="mt-4 mb-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">
            Main Sections
          </div>
        </div>
        
        {/* Roles Section */}
        <div className="mb-1">
          <button
            onClick={() => setActiveCategory(activeCategory === "roles" ? null : "roles")}
            className={cn(
              "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === "/dashboard/roles" 
                ? "bg-primary text-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Roles</span>
            </div>
            {activeCategory === "roles" ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {activeCategory === "roles" && (
            <div className="ml-4 mt-1 border-l border-border pl-2 flex flex-col gap-1 animate-fade-in">
              {roles.map(({ role, count }) => (
                <Link
                  key={role}
                  to={`/dashboard/roles/${role.toLowerCase()}`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    location.pathname === `/dashboard/roles/${role.toLowerCase()}`
                      ? "bg-secondary/20 font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{role}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Tasks Section */}
        <div className="mb-1">
          <button
            onClick={() => setActiveCategory(activeCategory === "tasks" ? null : "tasks")}
            className={cn(
              "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === "/dashboard/tasks" 
                ? "bg-primary text-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              <span>Tasks</span>
            </div>
            {activeCategory === "tasks" ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {activeCategory === "tasks" && (
            <div className="ml-4 mt-1 border-l border-border pl-2 flex flex-col gap-1 animate-fade-in">
              {tasks.map(({ task, count }) => (
                <Link
                  key={task}
                  to={`/dashboard/tasks/${task.toLowerCase()}`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    location.pathname === `/dashboard/tasks/${task.toLowerCase()}`
                      ? "bg-secondary/20 font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{task}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Analytics and Settings */}
        <Link
          to="/dashboard/analytics"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            location.pathname === "/dashboard/analytics"
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </Link>
        
        <Link
          to="/dashboard/settings"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            location.pathname === "/dashboard/settings"
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        
        <div className="mt-auto flex flex-col gap-4">
          <Link
            to="/about"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/about")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            About
          </Link>
          
          <Link
            to="/contact"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/contact")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            Contact
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
