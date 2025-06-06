
import { useState } from "react";
import { Prompt } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Star, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Prompt content has been copied to your clipboard",
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    // In a real app, this would open a share modal or copy a shareable link
    toast({
      title: "Share feature",
      description: "Share functionality would open here",
      duration: 2000,
    });
  };

  // Animation delay based on index for staggered appearance
  const animationDelay = `${index * 0.05}s`;
  
  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300",
        "border border-border hover:border-primary/20",
        "hover:shadow-premium animate-fade-in"
      )}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6 flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{prompt.title}</h3>
          <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {prompt.rating}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{prompt.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.roles.map((role) => (
            <Badge key={role} variant="outline" className="bg-primary/5">
              {role}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {prompt.tasks.map((task) => (
            <Badge key={task} variant="outline" className="bg-secondary/5">
              {task}
            </Badge>
          ))}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {prompt.views} views
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            
            <Button
              variant={copied ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                copied && "bg-primary text-primary-foreground"
              )}
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>
        
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary",
            "transform scale-x-0 origin-left transition-transform duration-300",
            isHovered && "scale-x-100"
          )}
        />
      </div>
    </div>
  );
}
