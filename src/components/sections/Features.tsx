
import { cn } from "@/lib/utils";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: "primary" | "secondary" | "blue" | "emerald";
  delay: number;
}

const Feature = ({ icon, title, description, gradient, delay }: FeatureProps) => {
  const gradientClasses = {
    primary: "from-indigo-500 to-violet-500",
    secondary: "from-pink-500 to-orange-500",
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-teal-500"
  };

  return (
    <div 
      className="group p-6 border border-border rounded-xl hover:border-primary/20 hover:shadow-premium transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={cn(
        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
        gradientClasses[gradient]
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default function Features() {
  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>,
      title: "Role-Based Organization",
      description: "Find and use prompts organized by professional roles like Developer, Designer, Marketer, Writer, and more.",
      gradient: "primary" as const,
      delay: 0.1
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>,
      title: "Task-Specific Prompts",
      description: "Browse prompts by the type of task you need to accomplish, from writing to analysis to code review.",
      gradient: "secondary" as const,
      delay: 0.2
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path><path d="M3 16.2V21m0-4.8H7.8"></path><path d="M21 7.8V3m0 4.8h-4.8"></path><path d="M3 7.8V3m0 4.8H7.8"></path></svg>,
      title: "Smart Discovery",
      description: "Easily search and filter prompts to find exactly what you need for your specific use case.",
      gradient: "blue" as const,
      delay: 0.3
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><path d="M12 20v-6"></path><path d="M17 20v-6"></path><path d="M7 20v-6"></path><path d="M17 14h.01"></path><path d="M7 14h.01"></path><path d="M12 14h.01"></path><path d="M7 4v4"></path><path d="M17 4v4"></path><path d="M12 4v4"></path><path d="M17 8h.01"></path><path d="M7 8h.01"></path><path d="M12 8h.01"></path></svg>,
      title: "Analytics Insights",
      description: "Track prompt usage and effectiveness with detailed analytics to optimize your AI interactions.",
      gradient: "emerald" as const,
      delay: 0.4
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12 stagger-animation">
        <h2 className="text-3xl font-bold mb-4">Key Features</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Our platform provides powerful tools to help you organize, discover, and use the most effective AI prompts for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Feature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            gradient={feature.gradient}
            delay={feature.delay}
          />
        ))}
      </div>
    </section>
  );
}
