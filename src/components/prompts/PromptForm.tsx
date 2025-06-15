
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllRoles, getAllTasks } from "@/data/prompts";
import { createPrompt } from "@/utils/supabasePromptUtils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const PromptForm: React.FC<{ onPromptCreated: () => void }> = ({ onPromptCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
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
        roles,
        tasks,
      }, user.email);
      toast({ title: "Prompt created!", duration: 2000 });
      setTitle(""); setDescription(""); setContent(""); setRoles([]); setTasks([]);
      onPromptCreated();
    } catch (error) {
      toast({ title: "Error", description: String(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleArray = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  return (
    <form className="mb-8 bg-card p-6 rounded-xl shadow border space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Share a new prompt</h2>
      <input
        className="w-full px-3 py-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Short description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <Textarea
        placeholder="Prompt content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />

      <div>
        <span className="font-medium mb-1">Roles:</span>
        <div className="flex flex-wrap gap-2">
          {getAllRoles().map(role => (
            <Badge
              key={role}
              variant={roles.includes(role) ? "default" : "outline"}
              onClick={() => toggleArray(roles, setRoles, role)}
              className="cursor-pointer"
            >
              {role}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <span className="font-medium mb-1">Tasks:</span>
        <div className="flex flex-wrap gap-2">
          {getAllTasks().map(task => (
            <Badge
              key={task}
              variant={tasks.includes(task) ? "default" : "outline"}
              onClick={() => toggleArray(tasks, setTasks, task)}
              className="cursor-pointer"
            >
              {task}
            </Badge>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading} className="mt-2 w-full">Create Prompt</Button>
    </form>
  );
};

export default PromptForm;
