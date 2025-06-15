
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, LogIn } from "lucide-react";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background">
      <div className="w-full max-w-md border border-border rounded-lg p-8 shadow-xl bg-card animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <LogIn className="h-6 w-6 text-primary" /> Sign In
        </h1>
        <p className="mb-6 text-muted-foreground">Sign in to access all prompts and features.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              autoFocus
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              required
              minLength={3}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
          <Button type="submit" size="lg" className="w-full">Sign In</Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          No account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
