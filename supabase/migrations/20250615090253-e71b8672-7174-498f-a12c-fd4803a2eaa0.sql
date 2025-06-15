
-- Add avatar_url and bio to public.profiles
ALTER TABLE public.profiles
ADD COLUMN avatar_url text,
ADD COLUMN bio text;
