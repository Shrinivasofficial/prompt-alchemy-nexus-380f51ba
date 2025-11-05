import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Role, Task } from "@/types";
import { getRolesWithCount, getTasksWithCount } from "@/data/prompts";
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
  X,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarMainLinks from "@/components/layout/sidebar/SidebarMainLinks";
import SidebarSectionLinks from "@/components/layout/sidebar/SidebarSectionLinks";
import SidebarProfileLink from "@/components/layout/sidebar/SidebarProfileLink";
import SidebarFooterLinks from "@/components/layout/sidebar/SidebarFooterLinks";

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
  <div className="h-8 w-8 rounded-md flex items-center justify-center">
    <img
      src="/Promptnexus.png"     // 👈 your logo file in public folder
      alt="PromptNexus logo"
      className="h-8 w-8 object-contain"
    />
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
        {/* Main Nav */}
        <SidebarMainLinks />
        {/* Section Nav */}
        <SidebarSectionLinks />
        {/* Profile Link */}
        <SidebarProfileLink />
        {/* Footer Links */}
        <SidebarFooterLinks />
      </aside>
    </>
  );
};

export default Sidebar;
