import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import { useAuth } from "@/context/AuthContext";
import { LogIn, User } from "lucide-react";
import MainNavbar from "@/components/layout/MainNavbar";

const Index = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user, signOut } = useAuth();

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-15 w-15 rounded-md flex items-center justify-center">
    <img
      src="/Promptnexus.png"     // 👈 your logo file in public folder
      alt="PromptNexus logo"
      className="h-12 w-12 object-contain"
    />
  </div>
            <span className="text-xl font-semibold">PromptNexus</span>
          </div>
          <MainNavbar signOut={signOut} />
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Button asChild variant="default" className="hidden md:flex bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Link to="/signin" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="hidden md:flex">
                  <Link to="/signup" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {/* Profile button (mobile and desktop), visible only when logged in */}
                <Button asChild variant="outline" className="hidden md:flex" >
                  <Link to="/profile">
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" className="hidden md:flex" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            )}
            <Button asChild variant="outline" className="md:hidden">
              <Link to="/dashboard">Menu</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        <Hero />
        <Features />
        
        <section className="container mx-auto px-4 py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-secondary rounded-full opacity-10 blur-3xl" />
          
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to supercharge your AI productivity?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start organizing, discovering, and optimizing your AI prompts today. PromptNexus makes it easy to find the perfect prompt for any task.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
              {/* <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button> */}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-md flex items-center justify-center">
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

export default Index;
