
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarProfileLink() {
  const location = useLocation();
  return (
    <Link
      to="/profile"
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors mt-2",
        location.pathname === "/profile"
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <User className="h-4 w-4" />
      <span>Profile</span>
    </Link>
  );
}
