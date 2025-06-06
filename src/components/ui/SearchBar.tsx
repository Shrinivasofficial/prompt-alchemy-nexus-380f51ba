
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = "Search prompts...", className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "relative w-full max-w-lg transition-all duration-300",
        isFocused ? "scale-[1.02]" : "scale-100",
        className
      )}
    >
      <div className={cn(
        "flex items-center h-10 w-full rounded-md border bg-background transition-all duration-300",
        isFocused 
          ? "border-primary ring-2 ring-primary/20 shadow-md" 
          : "border-input"
      )}>
        <div className="flex w-full items-center">
          <Search 
            className={cn(
              "ml-2 h-5 w-5 shrink-0 transition-colors duration-300",
              isFocused ? "text-primary" : "text-muted-foreground"
            )} 
          />
          <input
            className="flex w-full h-full rounded-md bg-transparent py-2 px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
      
      {/* Animated glow effect on focus */}
      {isFocused && (
        <div className="absolute inset-0 -z-10 bg-primary/20 blur-xl rounded-md opacity-50" />
      )}
    </form>
  );
}
