
import { FileText, Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import * as utils from "@/utils/supabasePromptUtils";
import { useState } from "react";
import { PromptDB } from "@/types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import type { User } from "@supabase/supabase-js";

interface PromptCardActionsProps {
  prompt: PromptDB;
  user: User | null;
  isOwner: boolean;
  copied: boolean;
  setCopied: (v: boolean) => void;
  setShowUsage: (v: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PromptCardActions({
  prompt,
  user,
  isOwner,
  copied,
  setCopied,
  setShowUsage,
  onEdit,
  onDelete,
}: PromptCardActionsProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await utils.deletePrompt(prompt.id);
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted.",
      });
      setDeleteDialogOpen(false);
      if (onDelete) onDelete();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "Could not delete prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setShowUsage(true)}
      >
        <FileText className="h-4 w-4" />
        <span className="sr-only">Sample Usage</span>
      </Button>
      {/* Copy button for non-owners */}
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
      {/* Owner controls */}
      {isOwner && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEdit}
            title="Edit prompt"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this prompt?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The prompt will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}

