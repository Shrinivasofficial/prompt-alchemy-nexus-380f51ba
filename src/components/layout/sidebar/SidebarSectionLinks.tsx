
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, ListTodo, ChevronDown, ChevronRight, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRolesWithCount, getTasksWithCount } from "@/data/prompts";

export default function SidebarSectionLinks() {
  const [activeCategory, setActiveCategory] = useState<"roles" | "tasks" | null>(null);
  const location = useLocation();
  const roles = getRolesWithCount();
  const tasks = getTasksWithCount();

  return (
    <>
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
    </>
  );
}
