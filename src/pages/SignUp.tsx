
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || username.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    if (password.length < 3) {
      setError("Password must be at least 3 characters.");
      return;
    }

    const success = await signUp(email, password);
    if (success) {
      // Retrieve current session so we have the user id
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (user) {
        // Upsert profile into "profiles" table
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            [
              {
                id: user.id,
                email: user.email,
                username,
              },
            ],
            { onConflict: ["id"] }
          );
        if (profileError) {
          setError("Signed up, but failed to save username: " + profileError.message);
          // Optionally let user continue
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Signup succeeded, but user not found. Try signing in.");
      }
    } else {
      setError("Email already in use. Please use another or sign in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background">
      <div className="w-full max-w-md border border-border rounded-lg p-8 shadow-xl bg-card animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <User className="h-6 w-6 text-primary" /> Sign Up
        </h1>
        <p className="mb-6 text-muted-foreground">
          Create an account to access all prompts and features.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              type="text"
              autoFocus
              placeholder="Username"
              value={username}
              required
              minLength={2}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Input
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
              placeholder="Password (min 3 chars)"
              value={password}
              required
              minLength={3}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
          <Button type="submit" size="lg" className="w-full">
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
