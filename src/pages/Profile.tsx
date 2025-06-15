
import { useEffect, useState, ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarUploader from "@/components/profile/AvatarUploader";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const { toast } = useToast();

  // Fetch profile data on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, bio")
        .eq("id", user.id)
        .single();
      if (error) {
        setUsername("");
        setAvatarUrl(null);
        setBio("");
      } else if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url);
        setBio(data.bio || "");
      }
    })();
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
      setSaved("");
    } else {
      setEditing(false);
      setSaved("Profile saved!");
      toast({ title: "Profile updated", description: "Your profile has been saved!" });
    }
  }

  function handleAvatarUploaded(url: string | null) {
    setAvatarUrl(url);
    toast({ title: "Avatar updated!" });
    // Update DB immediately
    if (user && url)
      supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  }

  if (!user) {
    return (
      <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md">
        <p>You must be signed in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md animate-fade-in flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-24 w-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Avatar" />
          ) : (
            <AvatarFallback className="text-xl bg-muted">{username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          )}
        </Avatar>
        <AvatarUploader
          userId={user.id}
          onUploaded={handleAvatarUploaded}
        />
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
          onChange={e => setUsername(e.target.value)}
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
          onChange={e => setBio(e.target.value)}
          readOnly={!editing}
          placeholder="A few words about you..."
          className="min-h-[64px]"
          maxLength={240}
        />
      </div>
      <div className="flex gap-3">
        {editing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit profile</Button>
        )}
      </div>
    </div>
  );
}
