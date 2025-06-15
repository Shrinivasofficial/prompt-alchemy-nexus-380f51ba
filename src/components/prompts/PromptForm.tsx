
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllRoles, getAllTasks } from "@/data/prompts";
import { createPrompt } from "@/utils/supabasePromptUtils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

const PromptForm: React.FC<{ onPromptCreated?: () => void, postSubmitCallback?: () => void }> = ({ onPromptCreated, postSubmitCallback }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [sample, setSample] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPrompt({
        title,
        description,
        content,
        roles: [role],
        tasks: [task],
      }, user.email);
      toast({ title: "Prompt created!", duration: 2000 });
      setTitle(""); setRole(""); setTask(""); setDescription(""); setContent(""); setSample("");
      onPromptCreated && onPromptCreated();
      postSubmitCallback && postSubmitCallback();
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Add a Prompt</h2>
      <div>
        <Label>Title</Label>
        <Input
          placeholder="Prompt title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Role</Label>
        <Select value={role} onValueChange={setRole} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose role..." />
          </SelectTrigger>
          <SelectContent>
            {getAllRoles().map(opt =>
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Task</Label>
        <Select value={task} onValueChange={setTask} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose task..." />
          </SelectTrigger>
          <SelectContent>
            {getAllTasks().map(opt =>
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            )}
          </SelectContent>
        </Select>
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
        <Label>Sample (optional)</Label>
        <Textarea
          placeholder="Sample output (optional)"
          value={sample}
          onChange={e => setSample(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading} className="mt-2 w-full">Submit</Button>
    </form>
  );
};

export default PromptForm;
