import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarUploader from "@/components/profile/AvatarUploader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ✅ FIXED: Only navigate when loading is finished and user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  // ✅ Don't render redirect messages before auth state is known
  if (loading) {
    return (
      <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md">
        <p>You must be signed in to view your profile.</p>
      </div>
    );
  }

  // Fetch profile from Supabase
  const fetchProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url, bio")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setUsername("");
      setAvatarUrl(null);
      setBio("");
      console.warn("Failed to fetch profile:", error.message);
    } else if (data) {
      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url);
      setBio(data.bio || "");
      console.log("[Profile] Loaded profile:", data);
    }

    setLoadingProfile(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleSave() {
    setError("");
    setSaved("");
    if (!user) return;

    if (!username || username.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username, bio })
      .eq("id", user.id);

    if (error) {
      setError("Failed to update profile.");
      console.warn("Profile update failed:", error.message);
    } else {
      setEditing(false);
      setSaved("Profile saved!");
      toast({
        title: "Profile updated",
        description: "Your profile has been saved!",
      });
      console.log("[Profile] Profile updated: ", { username, bio });
      fetchProfile();
    }
  }

  function handleAvatarUploaded(url: string | null) {
    setAvatarUrl(url);
    toast({ title: "Avatar updated!" });

    if (user && url)
      supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  }

  return (
    <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md animate-fade-in flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-24 w-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Avatar" />
          ) : (
            <AvatarFallback className="text-xl bg-muted">
              {username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>

        <AvatarUploader userId={user.id} onUploaded={handleAvatarUploaded} />
      </div>

      <h1 className="text-2xl font-bold text-center">My Profile</h1>

      <div className="mb-2">
        <label className="block text-muted-foreground mb-1">Email</label>
        <Input value={user.email} readOnly className="bg-muted" />
      </div>

      <div className="mb-2">
        <label className="block text-muted-foreground mb-1">Display Name</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          readOnly={!editing}
          minLength={2}
        />
        {error && <div className="text-destructive text-sm">{error}</div>}
        {saved && <div className="text-green-600 text-sm">{saved}</div>}
      </div>

      <div className="mb-2">
        <label className="block text-muted-foreground mb-1">Bio</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          readOnly={!editing}
          placeholder="A few words about you..."
          className="min-h-[64px]"
          maxLength={240}
        />
      </div>

      <div className="flex gap-3">
        {editing ? (
          <>
            <Button onClick={handleSave} disabled={loadingProfile}>
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              disabled={loadingProfile}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)} disabled={loadingProfile}>
            Edit profile
          </Button>
        )}
      </div>
    </div>
  );
}
