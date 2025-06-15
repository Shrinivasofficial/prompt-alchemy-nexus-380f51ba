
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard } from "lucide-react";

export default function SidebarMainLinks() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
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
  );
}
