
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (error) {
        setUsername("");
      } else if (data?.username) {
        setUsername(data.username);
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
      .update({ username })
      .eq("id", user.id);
    if (error) {
      setError("Failed to update profile.");
      setSaved("");
    } else {
      setEditing(false);
      setSaved("Profile saved!");
    }
  }

  if (!user) {
    return (
      <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md">
        <p>You must be signed in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 max-w-lg mx-auto bg-card rounded-lg shadow-md animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <div className="mb-4">
        <label className="block text-muted-foreground mb-1">Email</label>
        <Input value={user.email} readOnly className="bg-muted" />
      </div>
      <div className="mb-4">
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
      <div className="flex gap-3">
        {editing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>
    </div>
  );
}
