
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllRoles, getAllTasks } from "@/data/prompts";
import { createPrompt, updatePrompt } from "@/utils/supabasePromptUtils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PromptDB } from "@/types";

interface PromptFormProps {
  onPromptCreated?: () => void;
  postSubmitCallback?: () => void;
  existingPrompt?: PromptDB | null;
  isEditMode?: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onPromptCreated, postSubmitCallback, existingPrompt, isEditMode }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Multi-select support
  const [title, setTitle] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [sample, setSample] = useState("");
  const [loading, setLoading] = useState(false);

  // Input validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Pre-fill fields if editing
  useEffect(() => {
    if (existingPrompt) {
      setTitle(existingPrompt.title);
      setDescription(existingPrompt.description);
      setContent(existingPrompt.content);
      setRoles(existingPrompt.roles || []);
      setTasks(existingPrompt.tasks || []);
      setSample(existingPrompt.sample_output || "");
    }
    if (!isEditMode || !existingPrompt) {
      setTitle("");
      setDescription("");
      setContent("");
      setRoles([]);
      setTasks([]);
      setSample("");
    }
    // eslint-disable-next-line
  }, [existingPrompt, isEditMode]);

  if (!user) return null;

  // Multi-select togglers for roles/tasks
  const handleToggle = (item: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const validate = () => {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!description.trim()) errs.push("Description is required");
    if (!content.trim()) errs.push("Prompt content is required");
    if (!roles.length) errs.push("At least one Role is required");
    if (!tasks.length) errs.push("At least one Task is required");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (v.length > 0) return;

    setLoading(true);
    try {
      if (isEditMode && existingPrompt) {
        await updatePrompt(
          existingPrompt.id,
          {
            title,
            description,
            content,
            roles,
            tasks,
            sample_output: sample || null,
          }
        );
        toast({ title: "Prompt updated successfully!", duration: 2000, variant: "default" });
      } else {
        await createPrompt(
          {
            title,
            description,
            content,
            roles,
            tasks,
            sample_output: sample || null,
          },
          user.id
        );
        toast({ title: "Prompt added successfully!", duration: 2000, variant: "default" });
        setTitle("");
        setRoles([]);
        setTasks([]);
        setDescription("");
        setContent("");
        setSample("");
      }
      setErrors([]);
      onPromptCreated && onPromptCreated();
      postSubmitCallback && postSubmitCallback();
    } catch (error: any) {
      // Show better error messages from Supabase
      toast({
        title: "Error",
        description: typeof error?.message === "string"
          ? error.message
          : JSON.stringify(error, null, 2),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // For multi-select display
  const availableRoles = getAllRoles();
  const availableTasks = getAllTasks();

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">
        {isEditMode ? "Edit Prompt" : "Add a Prompt"}
      </h2>

      {errors.length > 0 && (
        <div className="p-3 bg-red-100 border border-destructive text-destructive rounded-md text-sm">
          {errors.map(e => <div key={e}>{e}</div>)}
        </div>
      )}

      <div>
        <Label>Title</Label>
        <Input
          placeholder="Prompt title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div>
        <Label>Roles</Label>
        <div className="flex flex-wrap gap-2 pt-1">
          {availableRoles.map(opt => (
            <Badge
              key={opt}
              className={`cursor-pointer ${roles.includes(opt) ? "bg-primary text-white" : "bg-muted/50"}`}
              onClick={() => handleToggle(opt, roles, setRoles)}
              variant={roles.includes(opt) ? "default" : "outline"}
            >
              {opt}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <Label>Tasks</Label>
        <div className="flex flex-wrap gap-2 pt-1">
          {availableTasks.map(opt => (
            <Badge
              key={opt}
              className={`cursor-pointer ${tasks.includes(opt) ? "bg-secondary text-primary" : "bg-muted/50"}`}
              onClick={() => handleToggle(opt, tasks, setTasks)}
              variant={tasks.includes(opt) ? "secondary" : "outline"}
            >
              {opt}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Short description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Prompt</Label>
        <Textarea
          placeholder="Prompt text"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Sample Output <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Textarea
          placeholder="Sample output (optional)"
          value={sample}
          onChange={e => setSample(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        disabled={loading || validate().length > 0}
        className="mt-2 w-full"
      >
        {loading
          ? (isEditMode ? "Updating..." : "Submitting...")
          : (isEditMode ? "Update Prompt" : "Submit")}
      </Button>
    </form>
  );
};

export default PromptForm;
