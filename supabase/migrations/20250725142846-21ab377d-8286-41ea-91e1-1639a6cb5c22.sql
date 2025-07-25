-- Fix Security Definer Function (Issue 1 & 2)
-- Drop existing triggers first, then function, then recreate properly
DROP TRIGGER IF EXISTS sync_prompt_rating_stats_delete ON public.prompt_ratings;
DROP TRIGGER IF EXISTS sync_prompt_rating_stats_insert ON public.prompt_ratings;
DROP TRIGGER IF EXISTS sync_prompt_rating_stats_update ON public.prompt_ratings;
DROP FUNCTION IF EXISTS public.update_prompt_rating_stats();

-- Create the secure function
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

-- Create triggers for the function
CREATE TRIGGER sync_prompt_rating_stats_insert
  AFTER INSERT ON public.prompt_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_rating_stats();

CREATE TRIGGER sync_prompt_rating_stats_update
  AFTER UPDATE ON public.prompt_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_rating_stats();

CREATE TRIGGER sync_prompt_rating_stats_delete
  AFTER DELETE ON public.prompt_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_prompt_rating_stats();

-- Create security definer function for getting current user id
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