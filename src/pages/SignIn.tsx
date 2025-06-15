
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
    const redirectTo = window.location.origin + "/reset-password";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      setNotification("We couldn't send a reset link. Double-check the email and ensure the URL is allowed in your Supabase project.");
    } else {
      setNotification("A reset link was sent! Please check your inbox and follow the instructions.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1.5px] animate-fade-in">
      <div className="bg-card shadow-2xl rounded-2xl px-8 py-7 w-full max-w-sm flex flex-col animate-fade-in border border-muted min-w-[340px] sm:min-w-[400px]">
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full h-12 w-12 mb-2">
            <Mail size={28} />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-[2px]">Forgot Password?</h2>
          <p className="text-muted-foreground text-sm text-center">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            required
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full text-base font-semibold py-2"
            disabled={loading}
            variant="default"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {notification && (
          <div className={`text-center rounded-md mt-4 px-3 py-2 text-sm ${notification.startsWith('A reset link') ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
            {notification}
          </div>
        )}
        <Button
          variant="link"
          className="mt-5 w-full text-primary text-sm"
          onClick={onClose}
          tabIndex={0}
        >
          Back to Sign In
        </Button>
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
      setError("Email or password was not recognized. Please try again!");
    }
  };

  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
      headline={<span className="gradient-text">Sign In</span>}
      description="Sign in to access your prompts and creative tools."
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
        {error && <div className="rounded text-destructive bg-destructive/10 px-3 py-2 text-sm">{error}</div>}
        <Button type="submit" size="lg" className="w-full text-base font-semibold flex items-center gap-2">
          <LogIn size={20} /> Sign In
        </Button>
      </form>
      <div className="flex justify-between mt-4 text-sm gap-3">
        <Button variant="link" className="p-0 text-primary" onClick={() => setShowReset(true)}>
          Forgot password?
        </Button>
        <span className="text-muted-foreground">
          No account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </span>
      </div>
      <ForgotPasswordDialog open={showReset} onClose={() => setShowReset(false)} />
    </AuthLayout>
  );
}

