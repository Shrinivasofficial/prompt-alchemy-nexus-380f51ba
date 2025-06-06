
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div 
        className="absolute top-40 -right-40 w-96 h-96 bg-gradient-primary rounded-full opacity-10 blur-3xl animate-pulse-slow" 
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div 
        className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-secondary rounded-full opacity-10 blur-3xl animate-pulse-slow" 
        style={{ animationDelay: "1s", transform: `translateY(${scrollY * 0.05}px)` }}
      />
      <div 
        className="absolute top-60 left-1/3 w-64 h-64 bg-electric-blue rounded-full opacity-10 blur-3xl animate-pulse-slow" 
        style={{ animationDelay: "2s", transform: `translateY(${scrollY * 0.15}px)` }}
      />

      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto stagger-animation">
          <div className="inline-block bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
            Organize and leverage AI prompts like never before
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Craft Perfect</span> AI Prompts for <span className="gradient-text-secondary">Any Role</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl">
            A beautifully designed system to organize, discover, and optimize AI prompts for different professional roles and tasks. Boost your productivity and get better results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/dashboard" className="px-8">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          {/* Preview window */}
          <div className="w-full max-w-5xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none h-24" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-24 bottom-0 top-auto" />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none w-24" />
            <div className="absolute inset-0 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none w-24 left-auto right-0" />
            
            <div className="w-full h-[500px] rounded-xl border border-border bg-gradient-soft shadow-premium overflow-hidden">
              <div className="h-10 border-b border-border bg-muted/50 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="mx-auto text-xs text-muted-foreground">
                  PromptNexus - Dashboard
                </div>
              </div>
              <div className="h-[460px]">
                <iframe 
                  src="/dashboard" 
                  title="Dashboard Preview" 
                  className="w-full h-full"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
