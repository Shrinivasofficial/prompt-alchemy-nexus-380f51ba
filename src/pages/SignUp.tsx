
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export default function SignUp() {
  //
  //
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
    
    // Client-side validation
    if (!username || username.length < 2) {
      setError("Please pick a username with at least 2 characters.");
      return;
    }
    
    const result = await signUp(email, password);
    if (result.success) {
      // Retrieve current session so we have the user id
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (user) {
        // Ensure profile row (will not overwrite existing one)
        try {
          await supabase
            .from("profiles")
            .upsert([
                { id: user.id, email: user.email, username }
              ],
              { onConflict: "id", ignoreDuplicates: false }
            );
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
      setInfo("Sign up successful! Please check your email to verify your account before signing in.");
    } else {
      setError(result.error || "Sign up failed. Please try again.");
    }
  };

  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=700&q=80"
      headline={<span className="gradient-text">Sign Up</span>}
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
          placeholder="Password (min 8 chars)"
          value={password}
          required
          minLength={8}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="text-xs text-muted-foreground">
          Password must contain: 8+ characters, uppercase, lowercase, number, and special character
        </div>
        {error && (
          <div className="rounded text-destructive bg-destructive/10 px-3 py-2 text-sm">{error}</div>
        )}
        {info && (
          <div className="rounded text-primary bg-primary/10 px-3 py-2 text-sm">{info}</div>
        )}
        <Button type="submit" size="lg" className="w-full text-base font-semibold flex items-center gap-2">
          <User size={20} /> Sign Up
        </Button>
      </form>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
