
import { Prompt, Role, Task } from "../types";

export const prompts: Prompt[] = [
  {
    id: "1",
    title: "Clean Code Reviewer",
    description: "AI assistant that reviews code for best practices and suggests improvements",
    content: "You are a senior software engineer with 15+ years of experience. Review my code for readability, maintainability, performance, and security issues. Suggest specific improvements following clean code principles. Format your response with sections: Overall Assessment, Code Quality Issues (with line references), Suggested Refactoring, and Best Practice Tips.",
    roles: ["Developer", "Analyst"],
    tasks: ["Code Review", "Analysis", "Technical"],
    views: 1245,
    rating: 4.8,
    createdAt: "2023-11-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Marketing Email Copywriter",
    description: "Generates compelling email marketing copy with high conversion rates",
    content: "You are an expert email copywriter specialized in driving conversions. Write a marketing email for the following product: [PRODUCT]. The email should have a compelling subject line, engaging opening, clear value proposition, persuasive body, and strong call-to-action. Use psychological triggers and maintain brand voice that is [BRAND VOICE]. Target audience is [AUDIENCE].",
    roles: ["Marketer", "Writer"],
    tasks: ["Writing", "Creative", "Communication"],
    views: 982,
    rating: 4.7,
    createdAt: "2023-10-22T14:15:00Z"
  },
  {
    id: "3",
    title: "UI Design Feedback Generator",
    description: "Provides detailed, actionable feedback on user interface designs",
    content: "You are a senior UI/UX designer with expertise in usability, accessibility, and visual design. Analyze this UI design and provide comprehensive feedback. Include analysis of layout hierarchy, visual consistency, color theory application, typography choices, accessibility considerations, interaction design, and alignment with user goals. Suggest specific improvements with visual examples when possible.",
    roles: ["Designer"],
    tasks: ["Analysis", "Creative", "Technical"],
    views: 765,
    rating: 4.9,
    createdAt: "2023-12-03T09:45:00Z"
  },
  {
    id: "4",
    title: "SWOT Analysis Generator",
    description: "Creates detailed SWOT analyses for business planning",
    content: "You are a strategic business analyst with MBA background. Conduct a comprehensive SWOT analysis for [BUSINESS/PRODUCT]. For each category (Strengths, Weaknesses, Opportunities, Threats), provide 5-7 detailed points with brief explanations. Consider internal factors (resources, capabilities, USPs) and external factors (market trends, competition, economic factors). Conclude with 3-5 strategic recommendations based on the analysis.",
    roles: ["Analyst", "Manager", "Product Manager"],
    tasks: ["Analysis", "Research", "Planning"],
    views: 1102,
    rating: 4.6,
    createdAt: "2023-09-18T11:20:00Z"
  },
  {
    id: "5",
    title: "Technical Documentation Writer",
    description: "Creates clear, concise technical documentation for complex systems",
    content: "You are a technical writer specialized in creating clear documentation for complex software. Write comprehensive documentation for [FEATURE/API] that includes: Overview & Purpose, Prerequisites, Installation Steps, Configuration Options, Usage Examples with code snippets, Common Issues & Troubleshooting, and API Reference. Format with proper Markdown headings, code blocks, tables, and notes for maximum clarity. Target audience is [AUDIENCE TECHNICAL LEVEL].",
    roles: ["Developer", "Writer", "Technical"],
    tasks: ["Writing", "Technical", "Communication"],
    views: 843,
    rating: 4.5,
    createdAt: "2023-11-28T16:05:00Z"
  },
  {
    id: "6",
    title: "Sprint Planning Assistant",
    description: "Helps plan and organize development sprints effectively",
    content: "You are an experienced agile scrum master. Help me organize a 2-week sprint for my development team. Based on these user stories and team capacity [DETAILS], break down work into tasks, estimate story points, identify dependencies, suggest a realistic sprint goal, and create a risk management plan. Provide recommendations for sprint rituals and how to handle potential blockers.",
    roles: ["Manager", "Product Manager", "Developer"],
    tasks: ["Planning", "Analysis", "Communication"],
    views: 689,
    rating: 4.7,
    createdAt: "2023-10-10T08:30:00Z"
  },
  {
    id: "7",
    title: "Creative Ad Concept Generator",
    description: "Generates innovative advertising concepts for marketing campaigns",
    content: "You are a creative director at a top advertising agency. Generate 5 innovative ad concepts for [PRODUCT/SERVICE] targeting [AUDIENCE]. Each concept should include: a compelling headline, key visual description, core message, emotional appeal, and channel recommendations. Concepts should be distinct from each other and push creative boundaries while remaining aligned with brand values of [BRAND VALUES]. Include a brief explanation of why each concept would resonate with the target audience.",
    roles: ["Marketer", "Designer", "Writer"],
    tasks: ["Creative", "Writing"],
    views: 1320,
    rating: 4.9,
    createdAt: "2023-12-15T13:25:00Z"
  },
  {
    id: "8",
    title: "Customer Support Email Template",
    description: "Professional templates for handling common customer support scenarios",
    content: "You are a customer experience manager with expertise in support communications. Create a template for responding to this customer issue: [ISSUE TYPE]. The response should express empathy, clearly address the customer's concern, provide a solution or clear next steps, include any relevant policy information without being rigid, and end with a positive forward-looking statement. Tone should be [TONE] and align with a brand voice that is [BRAND VOICE]. Include placeholders for customization and handling variations of the scenario.",
    roles: ["Customer Support", "Writer"],
    tasks: ["Writing", "Communication"],
    views: 574,
    rating: 4.4,
    createdAt: "2023-11-05T17:10:00Z"
  },
  {
    id: "9",
    title: "Competitor Analysis Framework",
    description: "Structured approach to analyzing market competitors",
    content: "You are a strategic market analyst. Create a comprehensive competitor analysis for [COMPANY] compared to these competitors: [COMPETITOR LIST]. The analysis should include: Market Positioning, Product/Service Comparison (feature matrix), Pricing Strategy, Marketing & Messaging Approach, Distribution Channels, SWOT for each competitor, Customer Sentiment Analysis (based on available reviews), and Competitive Advantage Assessment. Conclude with strategic recommendations for how [COMPANY] can strengthen its market position.",
    roles: ["Analyst", "Product Manager", "Marketer"],
    tasks: ["Analysis", "Research", "Planning"],
    views: 901,
    rating: 4.8,
    createdAt: "2023-09-30T10:40:00Z"
  },
  {
    id: "10",
    title: "Interactive Prototype Tester",
    description: "Simulates user testing sessions for interactive prototypes",
    content: "You are a UX researcher conducting a usability test. Based on this prototype description [PROTOTYPE DETAILS], simulate 5 different user testing sessions with diverse user personas. For each session, include: user background and goals, tasks attempted, verbal commentary during use, points of confusion, successful interactions, task completion status, and overall sentiment. Conclude with a summary of usability findings, prioritized UX issues, and specific recommendations for improvements.",
    roles: ["Designer", "Product Manager", "Analyst"],
    tasks: ["Analysis", "Research", "Technical"],
    views: 632,
    rating: 4.6,
    createdAt: "2023-11-20T15:50:00Z"
  },
  {
    id: "11",
    title: "Software Architecture Reviewer",
    description: "Reviews software architecture designs for scalability and maintainability",
    content: "You are a principal software architect with expertise in distributed systems. Review this system architecture: [ARCHITECTURE DETAILS]. Evaluate it for scalability, resilience, security, maintainability, and alignment with business requirements. Identify potential bottlenecks, single points of failure, and architectural smells. Suggest specific improvements referencing relevant architectural patterns and principles. Consider both technical excellence and practical implementation constraints.",
    roles: ["Developer", "Analyst"],
    tasks: ["Analysis", "Technical", "Code Review"],
    views: 789,
    rating: 4.9,
    createdAt: "2023-10-05T11:15:00Z"
  },
  {
    id: "12",
    title: "Content Strategy Planner",
    description: "Develops comprehensive content strategies for marketing teams",
    content: "You are a content strategy director. Create a 3-month content strategy for [BUSINESS/PRODUCT] targeting [AUDIENCE]. The strategy should include: content themes aligned with business goals, channel mix recommendations, content types and formats, publication calendar with frequency, performance metrics to track, SEO considerations, and resource requirements. Incorporate current content marketing trends and provide specific content ideas for the first month to kick-start implementation.",
    roles: ["Marketer", "Writer", "Product Manager"],
    tasks: ["Planning", "Creative", "Writing"],
    views: 1056,
    rating: 4.7,
    createdAt: "2023-12-08T09:35:00Z"
  }
];

export const getRolePrompts = (role: Role): Prompt[] => {
  return prompts.filter(prompt => prompt.roles.includes(role));
};

export const getTaskPrompts = (task: Task): Prompt[] => {
  return prompts.filter(prompt => prompt.tasks.includes(task));
};

export const getAllRoles = (): Role[] => {
  const roles = new Set<Role>();
  prompts.forEach(prompt => {
    prompt.roles.forEach(role => roles.add(role));
  });
  return Array.from(roles);
};

export const getAllTasks = (): Task[] => {
  const tasks = new Set<Task>();
  prompts.forEach(prompt => {
    prompt.tasks.forEach(task => tasks.add(task));
  });
  return Array.from(tasks);
};

export const getRolesWithCount = (): { role: Role; count: number }[] => {
  const roles = getAllRoles();
  return roles.map(role => ({
    role,
    count: getRolePrompts(role).length
  }));
};

export const getTasksWithCount = (): { task: Task; count: number }[] => {
  const tasks = getAllTasks();
  return tasks.map(task => ({
    task,
    count: getTaskPrompts(task).length
  }));
};

export const searchPrompts = (query: string): Prompt[] => {
  const lowerQuery = query.toLowerCase();
  return prompts.filter(
    prompt =>
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.content.toLowerCase().includes(lowerQuery)
  );
};
