
import { useState, useEffect } from "react";
import { PromptDB, ViewPromptAnalytics } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import * as utils from "@/utils/supabasePromptUtils";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PromptCardProps {
  prompt: PromptDB;
  analytics?: ViewPromptAnalytics;
  index?: number;
}

export function PromptCard({ prompt, analytics, index = 0 }: PromptCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [loadingRating, setLoadingRating] = useState(false);

  // Fetch user's own rating
  useEffect(() => {
    if (user) {
      utils.getUserPromptRating(prompt.id, user.id).then(r => setMyRating(r?.rating || null));
    }
  }, [user, prompt.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt content has been copied to your clipboard",
        duration: 2000,
      });
      if (user) await utils.logPromptCopy(prompt.id, user.id);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Rating star rendering
  const handleRate = async (rating: number) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to rate", variant: "destructive" });
      return;
    }
    setLoadingRating(true);
    try {
      await utils.ratePrompt(prompt.id, user.id, rating);
      setMyRating(rating);
      toast({ title: "Rated!", duration: 1300 });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    } finally {
      setLoadingRating(false);
    }
  };

  // Extract placeholders from the prompt content
  const extractPlaceholders = () => {
    const regex = /\[(.*?)\]/g;
    const content = prompt.content;
    let match;
    const placeholders = [];
    while ((match = regex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }
    return placeholders;
  };

  const generateSampleValues = (placeholder: string) => {
    const samples: {[key: string]: string[]} = {
      "PRODUCT": ["Smart Home Security System", "Organic Skincare Subscription Box", "AI Writing Assistant"],
      "BRAND VOICE": ["Professional & Authoritative", "Friendly & Conversational", "Playful & Energetic"],
      "AUDIENCE": ["Tech-savvy Millennials", "Busy Parents", "Small Business Owners"],
      "BUSINESS/PRODUCT": ["Fitness Mobile App", "Eco-friendly Cleaning Service", "Online Course Platform"],
      "FEATURE/API": ["User Authentication System", "Payment Processing API", "Data Visualization Library"],
      "AUDIENCE TECHNICAL LEVEL": ["Beginner Developers", "Experienced Engineers", "Non-technical Stakeholders"],
      "DETAILS": ["5 developers, 10 user stories", "3 designers, tight deadline", "Remote team, complex project"],
      "PROTOTYPE DETAILS": ["E-commerce Mobile App", "SaaS Dashboard Interface", "Healthcare Patient Portal"],
      "ARCHITECTURE DETAILS": ["Microservices Backend", "Serverless Function Architecture", "Monolithic Application"],
      "ISSUE TYPE": ["Payment Processing Error", "Account Access Problem", "Shipping Delay"],
    };
    return samples[placeholder] || ["Example 1", "Example 2", "Example 3"];
  };

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
            {(typeof analytics?.avg_rating === "number"
              ? analytics.avg_rating.toFixed(1)
              : (prompt.avg_rating || 0).toFixed(1))}
            <span className="ml-2">{(analytics?.ratings_count || prompt.ratings_count || 0)} ratings</span>
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
        <div className="mb-2 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleRate(i + 1)}
              className={cn(
                "text-yellow-400 transition",
                i < (myRating || 0) ? "fill-yellow-400" : "text-gray-300"
              )}
              disabled={loadingRating || !user}
              aria-label={`Rate ${i + 1} star`}
            >
              <Star className={i < (myRating || 0) ? "fill-yellow-400" : ""} size={20} />
            </button>
          ))}
          {loadingRating && <span className="text-xs ml-2">Saving...</span>}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {prompt.created_by}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowUsage(true)}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">Sample Usage</span>
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
      {/* Sample Usage Dialog */}
      <Dialog open={showUsage} onOpenChange={setShowUsage}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sample Usage</DialogTitle>
            <DialogDescription>
              Replace the placeholders with your specific information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap">{prompt.content}</pre>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Fill in these placeholders:</h4>
              {extractPlaceholders().map((placeholder) => (
                <div key={placeholder} className="space-y-2">
                  <h5 className="text-sm font-semibold">[{placeholder}]</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {generateSampleValues(placeholder).map((example, i) => (
                      <div 
                        key={i}
                        className="bg-background border border-border rounded-md p-2 text-xs"
                      >
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
