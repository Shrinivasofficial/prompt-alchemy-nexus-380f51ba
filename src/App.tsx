
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";

const queryClient = new QueryClient();

const App = () => {
  // Add: ensure user profile row always exists
  const { user } = useAuth();
  useEnsureProfile({ user });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            {/* App header/navbar, show profile link when logged in */}
            <header className="flex gap-4 px-4 py-3 items-center border-b border-muted bg-background">
              <Link to="/" className="font-bold text-xl text-primary">Prompt Alchemy</Link>
              <nav className="ml-auto flex gap-3">
                <Link to="/about" className="text-muted-foreground hover:underline">About</Link>
                <Link to="/contact" className="text-muted-foreground hover:underline">Contact</Link>
                {user && (
                  <Link to="/profile" className="font-medium text-primary hover:underline">Profile</Link>
                )}
              </nav>
            </header>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/:mode" element={<Dashboard />} />
              <Route path="/dashboard/:mode/:category" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
