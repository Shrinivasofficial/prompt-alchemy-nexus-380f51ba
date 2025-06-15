
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import * as utils from "@/utils/supabasePromptUtils";
import { PromptDB } from "@/types";
import { User } from "@/context/AuthContext";

interface PromptRatingProps {
  prompt: PromptDB;
  user: User | null;
  myRating: number | null;
  setMyRating: (rating: number) => void;
  loadingRating: boolean;
  setLoadingRating: (b: boolean) => void;
  isOwner: boolean;
}

export function PromptRating({
  prompt,
  user,
  myRating,
  setMyRating,
  loadingRating,
  setLoadingRating,
  isOwner
}: PromptRatingProps) {
  const { toast } = useToast();

  const handleRate = async (rating: number) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to rate", variant: "destructive" });
      return;
    }
    setLoadingRating(true);
    try {
      await utils.ratePrompt(prompt.id, user.id, rating, prompt.created_by);
      setMyRating(rating);
      toast({ title: "Rated!", duration: 1300 });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    } finally {
      setLoadingRating(false);
    }
  };

  if (isOwner) return null;

  return (
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
  );
}
