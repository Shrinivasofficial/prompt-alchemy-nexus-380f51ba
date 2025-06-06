
import { useState } from "react";
import { TabItem } from "@/types";
import { cn } from "@/lib/utils";

interface TabsListProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabsList({ tabs, activeTab, onTabChange }: TabsListProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  return (
    <div className="relative mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 border-b border-border min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const isHovered = hoveredTab === tab.value;
          
          return (
            <button
              key={tab.id}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => onTabChange(tab.value)}
              onMouseEnter={() => setHoveredTab(tab.value)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {tab.label}
              <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
                {tab.count}
              </span>
              
              {/* Active/hover indicator line */}
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-full bg-primary transform transition-transform duration-300",
                  isActive ? "scale-x-100" : "scale-x-0",
                  isHovered && !isActive && "bg-primary/50 scale-x-100"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
