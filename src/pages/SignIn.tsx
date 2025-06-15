
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

function ForgotPasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotification("");
    setLoading(true);
    // Set correct redirectTo (must match allowed password reset URLs in Supabase dashboard!)
    const redirectTo = window.location.origin + "/signin";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      setNotification("Failed to send email. Make sure your email exists and the redirect URL is allowed in your Supabase Auth settings.");
    } else {
      setNotification("Reset link sent. Please check your email and follow the instructions to reset your password.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-card rounded-lg shadow-lg p-8 w-full max-w-sm animate-fade-in">
        <h2 className="text-xl font-bold mb-3">Forgot Password?</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          {notification && (
            <div className="text-sm mt-2 text-muted-foreground">{notification}</div>
          )}
        </form>
        <button className="text-primary mt-6 w-full hover:underline" onClick={onClose}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await signIn(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
      headline="Sign In"
      description="Sign in to access all prompts and features."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          autoFocus
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          required
          minLength={3}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-destructive text-sm">{error}</div>}
        <Button type="submit" size="lg" className="w-full">Sign In</Button>
      </form>
      <div className="flex justify-between mt-4 text-sm">
        <button className="text-primary hover:underline" onClick={() => setShowReset(true)}>
          Forgot password?
        </button>
        <span>
          No account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </span>
      </div>
      <ForgotPasswordDialog open={showReset} onClose={() => setShowReset(false)} />
    </AuthLayout>
  );
}
