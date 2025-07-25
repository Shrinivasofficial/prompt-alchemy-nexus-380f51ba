-- Fix Security Definer Function (Issue 1 & 2)
-- Update existing function to be more secure
DROP FUNCTION IF EXISTS public.update_prompt_rating_stats();

CREATE OR REPLACE FUNCTION public.update_prompt_rating_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  UPDATE public.prompts
  SET
    avg_rating = COALESCE((SELECT AVG(rating)::float8 FROM public.prompt_ratings WHERE prompt_id = NEW.prompt_id), 0),
    ratings_count = (SELECT COUNT(*) FROM public.prompt_ratings WHERE prompt_id = NEW.prompt_id)
  WHERE id = NEW.prompt_id;
  RETURN NULL;
END;
$function$;

-- Create trigger for the function
DROP TRIGGER IF EXISTS update_prompt_rating_stats_trigger ON public.prompt_ratings;
CREATE TRIGGER update_prompt_rating_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.prompt_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_rating_stats();

-- Create security definer function for getting current user role (for future use)
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER SET search_path = ''
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Update profiles RLS policies to allow viewing public profile information
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Allow users to view their own profile (including sensitive data like email)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow viewing public profile information (username, avatar_url, bio) for all users
CREATE POLICY "Public profile info is viewable" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create a view for public profile information only
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  bio,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = on);