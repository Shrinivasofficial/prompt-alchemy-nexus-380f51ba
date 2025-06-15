import { useState, useEffect } from "react";
import { PromptDB, ViewPromptAnalytics } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import * as utils from "@/utils/supabasePromptUtils";
import { useAuth } from "@/context/AuthContext";
import { PromptRating } from "@/components/ui/PromptRating";
import { PromptCardActions } from "@/components/ui/PromptCardActions";
import { usePromptPlaceholders } from "@/hooks/usePromptPlaceholders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PromptEditForm from "@/components/ui/PromptEditForm";

interface PromptCardProps {
  prompt: PromptDB;
  analytics?: ViewPromptAnalytics;
  index?: number;
  username?: string; // new prop for username
}

export function PromptCard({ prompt, analytics, index = 0, username }: PromptCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [loadingRating, setLoadingRating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Is the current user the owner of this prompt?
  const isOwner = user && prompt.created_by === user.id;

  // Fetch user's own rating
  useEffect(() => {
    if (user) {
      utils.getUserPromptRating(prompt.id, user.id).then(r => setMyRating(r?.rating || null));
    }
  }, [user, prompt.id]);

  // Placeholder extraction and samples
  const { extractPlaceholders, generateSampleValues } = usePromptPlaceholders(prompt);

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
        <PromptRating
          prompt={prompt}
          user={user}
          myRating={myRating}
          setMyRating={setMyRating}
          loadingRating={loadingRating}
          setLoadingRating={setLoadingRating}
          isOwner={!!isOwner}
        />
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {/* Show username, or fallback; never show UID */}
            {username && username !== prompt.created_by
              ? username
              : "Unknown user"}
          </div>
          <div className="flex gap-2">
            <PromptCardActions
              prompt={prompt}
              user={user}
              isOwner={!!isOwner}
              copied={copied}
              setCopied={setCopied}
              setShowUsage={setShowUsage}
              onEdit={() => setShowEdit(true)}
              onDelete={() => window.location.reload()}
            />
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
      <PromptEditForm
        prompt={prompt}
        open={showEdit}
        onOpenChange={setShowEdit}
        onUpdated={() => {
          setShowEdit(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
