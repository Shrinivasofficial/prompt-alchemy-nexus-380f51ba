
export type Role = 
  | "Developer" 
  | "Designer" 
  | "Marketer" 
  | "Writer" 
  | "Analyst" 
  | "Manager" 
  | "Product Manager" 
  | "Customer Support"
  | "College Student"
  | "Technical"
  |"ChatGPT"
  |"Gemini"
  |"Claude"
  |"Perplexity"
  |"Image Generation";

export type Task = 
  | "Writing" 
  | "Analysis"
  | "Image Generation"
  | "Code Review" 
  | "Creative" 
  | "Technical" 
  | "Research" 
  | "Communication" 
  | "Learning"
  | "Planning";

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  roles: Role[];
  tasks: Task[];
  createdBy: string;
  rating: number;
  createdAt: string;
  views: number; // Add this property to fix error
}

export interface TabItem {
  id: string;
  label: string;
  count: number;
  value: string;
}

// Extend existing Prompt interface for DB-backed prompts
export interface PromptDB {
  id: string;
  title: string;
  description: string;
  content: string;
  roles: string[];
  tasks: string[];
  created_by: string;
  created_at: string;
  views: number;
  avg_rating: number;
  ratings_count: number;
  sample_output?: string | null; // <-- Fix: add sample_output here (nullable, optional)
}

export interface PromptRatingDB {
  id: string;
  prompt_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

export interface PromptViewDB {
  id: string;
  prompt_id: string;
  user_id: string;
  copied: boolean;
  created_at: string;
}

export interface ViewPromptAnalytics {
  prompt_id: string;
  avg_rating: number;
  ratings_count: number;
  total_views: number;
  total_copies: number;
}

