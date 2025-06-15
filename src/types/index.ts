
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
  | "Technical";

export type Task = 
  | "Writing" 
  | "Analysis" 
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
