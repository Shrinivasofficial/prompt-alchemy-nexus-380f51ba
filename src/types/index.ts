
export type Role = 
  | "Developer" 
  | "Designer" 
  | "Marketer" 
  | "Writer" 
  | "Analyst" 
  | "Manager" 
  | "Product Manager" 
  | "Customer Support";

export type Task = 
  | "Writing" 
  | "Analysis" 
  | "Code Review" 
  | "Creative" 
  | "Technical" 
  | "Research" 
  | "Communication" 
  | "Planning";

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  roles: Role[];
  tasks: Task[];
  views: number;
  rating: number;
  createdAt: string;
}

export interface TabItem {
  id: string;
  label: string;
  count: number;
  value: string;
}
