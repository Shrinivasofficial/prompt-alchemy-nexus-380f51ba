import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    // Simple client-side validation
    if (!username || username.length < 2) {
      setError("Please pick a username with at least 2 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      // Call Supabase signUp directly
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // optional metadata stored in auth.user.user_metadata
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      const user = data?.user;

      if (user) {
        try {
          // Create or update profile
          await supabase
            .from("profiles")
            .upsert(
              [{ id: user.id, email: user.email, username }],
              { onConflict: "id" }
            );
        } catch (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      setInfo(
        "✅ Sign up successful! Please check your email to verify your account before signing in."
      );

      // Optionally redirect after a delay
      setTimeout(() => navigate("/signin"), 4000);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again later.");
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
          placeholder="Username"
          value={username}
          required
          minLength={2}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          required
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-xs text-muted-foreground">
          Password must contain: 8+ characters, uppercase, lowercase, number, and
          special character
        </div>

        {error && (
          <div className="rounded text-destructive bg-destructive/10 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        {info && (
          <div className="rounded text-primary bg-primary/10 px-3 py-2 text-sm">
            {info}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-semibold flex items-center gap-2"
        >
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
