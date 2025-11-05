
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SidebarFooterLinks() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
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
      {/* <Link
        to="/contact"
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive("/contact")
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        Contact
      </Link> */}
    </div>
  );
}
