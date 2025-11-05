
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
             <div className="h-15 w-15 rounded-md flex items-center justify-center">
    <img
      src="/Promptnexus.png"     // 👈 your logo file in public folder
      alt="PromptNexus logo"
      className="h-12 w-12 object-contain"
    />
  </div>
            <span className="text-xl font-semibold">PromptNexus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover-underline">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover-underline">
              Dashboard
            </Link>
            <Link to="/about" className="text-sm font-medium hover-underline font-semibold text-primary">
              About
            </Link>
            {/* <Link to="/contact" className="text-sm font-medium hover-underline">
              Contact
            </Link> */}
          </nav>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="default" className="hidden md:flex bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-secondary rounded-full opacity-10 blur-3xl" />
          
          <div className="relative max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">About PromptNexus</h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              PromptNexus is a robust platform designed to revolutionize how professionals manage, discover, and utilize AI prompts across different domains.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              We believe that AI tools should enhance human creativity and productivity, not replace it. Our mission is to create a seamless bridge between human intention and AI capability through thoughtfully organized and optimized prompts.
            </p>
            <p className="text-lg text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              By organizing prompts by both professional roles and task types, we ensure that everyone can find the right prompt for their specific needs, regardless of their area of expertise or the task at hand.
            </p>
          </div>
        </section>
        
      
        
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in">Key Platform Features</h2>
            <p className="text-lg text-muted-foreground mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              PromptNexus is built to provide a seamless, intuitive experience for finding and managing AI prompts. Here are some of the key features that make our platform unique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto stagger-animation">
            {[
              {
                title: "Dual Organization System",
                description: "Browse prompts by professional roles or task types to find exactly what you need, when you need it."
              },
              {
                title: "Advanced Search & Filtering",
                description: "Quickly locate specific prompts with our powerful search functionality and intuitive filtering options."
              },
              {
                title: "Usage Analytics",
                description: "Track which prompts are most effective for different purposes with detailed usage statistics."
              },
              {
                title: "Cross-Reference Capability",
                description: "See how prompts can be applied across different roles and tasks for maximum versatility."
              }
            ].map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Join thousands of professionals who are already using PromptNexus to enhance their AI interactions and boost productivity.
            </p>
            
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/dashboard">
                Try the Dashboard <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-15 w-15 rounded-md flex items-center justify-center">
    <img
      src="/Promptnexus.png"     // 👈 your logo file in public folder
      alt="PromptNexus logo"
      className="h-10 w-10 object-contain"
    />
  </div>
                <span className="text-xl font-semibold">PromptNexus</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                A beautifully designed system for organizing, discovering, and optimizing AI prompts for different roles and tasks.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
                  </li>
                  {/* <li>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
                  </li> */}
                </ul>
              </div>
              
              {/* <div>
                <h3 className="text-sm font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Connect</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Discord</a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PromptNexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
