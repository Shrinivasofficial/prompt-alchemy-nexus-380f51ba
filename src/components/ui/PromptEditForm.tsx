
import React, { useState } from "react";
import PromptForm from "@/components/prompts/PromptForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PromptDB } from "@/types";

interface PromptEditFormProps {
  prompt: PromptDB | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

const PromptEditForm: React.FC<PromptEditFormProps> = ({
  prompt,
  open,
  onOpenChange,
  onUpdated,
}) => {
  if (!prompt) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 bg-background">
        <div className="py-6 px-6">
          <PromptForm
            existingPrompt={prompt}
            onPromptCreated={onUpdated}
            isEditMode
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptEditForm;

