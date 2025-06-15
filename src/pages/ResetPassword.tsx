
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setNotification(error.message || "Failed to reset password.");
    } else {
      setNotification("Password updated! Redirecting you to sign in...");
      setTimeout(() => navigate("/signin"), 1800);
    }
  };

  return (
    <AuthLayout
      headline={<span className="gradient-text">Reset Password</span>}
      description="Pick a strong new password for your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          required
          minLength={3}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        <Button type="submit" size="lg" className="w-full text-base font-semibold flex items-center gap-2" disabled={loading}>
          {loading ? "Updating..." : "Set New Password"}
        </Button>
        {notification && (
          <div className="text-sm mt-2 text-center rounded bg-muted px-3 py-2">{notification}</div>
        )}
      </form>
    </AuthLayout>
  );
}
