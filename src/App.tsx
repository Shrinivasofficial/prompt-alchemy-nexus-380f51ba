import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

// ✅ Wrap app routes in AuthProvider, then use the context INSIDE
function AppRoutes() {
  const { user } = useAuth();
  useEnsureProfile({
    user: user ? { id: user.id, email: user.email || "" } : null,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:mode" element={<Dashboard />} />
        <Route path="/dashboard/:mode/:category" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected route */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* ✅ AuthProvider must wrap where useAuth() is used */}
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>

      </TooltipProvider>
    </QueryClientProvider>
  );
}
