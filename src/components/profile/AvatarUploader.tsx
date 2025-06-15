
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AvatarUploader({
  userId,
  onUploaded,
}: {
  userId: string;
  onUploaded: (url: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // You need to have an 'avatars' bucket public in Supabase for this to work.
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    // Create unique filename per user
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    // Upload
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
      onUploaded(data.publicUrl);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2"
        aria-label="Upload avatar"
      >
        <Upload size={16} />
        {loading ? "Uploading..." : "Change Avatar"}
      </Button>
    </div>
  );
}
