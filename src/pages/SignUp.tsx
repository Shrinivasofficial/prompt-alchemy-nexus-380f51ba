
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // For notifications about verification

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

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
        await supabase
          .from("profiles")
          .upsert([
              { id: user.id, email: user.email, username }
            ],
            { onConflict: "id" }
          );
        // Email confirmation may be required
        setInfo("Sign up successful! Please check your email and verify your account before signing in.");
      } else {
        setInfo("Sign up successful! Please check your email and verify your account before signing in.");
      }
    } else {
      setError("Email already in use. Please use another or sign in.");
    }
  };

  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=700&q=80"
      headline="Sign Up"
      description="Create an account to access all prompts and features."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          autoFocus
          placeholder="Username"
          value={username}
          required
          minLength={2}
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password (min 3 chars)"
          value={password}
          required
          minLength={3}
          onChange={e => setPassword(e.target.value)}
        />
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}
        {info && (
          <div className="text-primary text-sm">{info}</div>
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
    </AuthLayout>
  );
}
