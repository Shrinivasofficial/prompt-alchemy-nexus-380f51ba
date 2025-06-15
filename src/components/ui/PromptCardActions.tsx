import { FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import * as utils from "@/utils/supabasePromptUtils";
import { useState } from "react";
import { PromptDB } from "@/types";

interface PromptCardActionsProps {
  prompt: PromptDB;
  user: { id: string; email: string } | null;
  isOwner: boolean;
  copied: boolean;
  setCopied: (v: boolean) => void;
  setShowUsage: (v: boolean) => void;
}

export function PromptCardActions({
  prompt,
  user,
  isOwner,
  copied,
  setCopied,
  setShowUsage
}: PromptCardActionsProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt content has been copied to your clipboard",
        duration: 2000,
      });
      if (user) await utils.logPromptCopy(prompt.id, user.id, prompt.created_by);
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

  return (
    <>
      {/* Sample Usage button always available */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setShowUsage(true)}
      >
        <FileText className="h-4 w-4" />
        <span className="sr-only">Sample Usage</span>
      </Button>
      {/* Copy button only if not owner */}
      {!isOwner && (
        <Button
          variant={copied ? "default" : "ghost"}
          size="sm"
          className={`h-8 w-8 p-0${copied ? " bg-primary text-primary-foreground" : ""}`}
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy</span>
        </Button>
      )}
    </>
  );
}
