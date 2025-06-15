
-- 1. Create the prompts table
CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  roles text[] NOT NULL,
  tasks text[] NOT NULL,
  sample_output text,
  created_by uuid NOT NULL, -- aligns with auth.uid()
  created_at timestamptz NOT NULL DEFAULT now(),
  views integer NOT NULL DEFAULT 0,
  avg_rating float8 NOT NULL DEFAULT 0,
  ratings_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prompts"
  ON public.prompts
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own prompts"
  ON public.prompts
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Prompt owner can update"
  ON public.prompts
  FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Prompt owner can delete"
  ON public.prompts
  FOR DELETE
  USING (created_by = auth.uid());

-- 2. Create prompt_views table user_id as uuid
CREATE TABLE public.prompt_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.prompts(id),
  user_id uuid NOT NULL,
  copied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert view" ON public.prompt_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can select views" ON public.prompt_views FOR SELECT USING (true);

-- 3. Create prompt_ratings table user_id as uuid
CREATE TABLE public.prompt_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.prompts(id),
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (prompt_id, user_id)
);

ALTER TABLE public.prompt_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert rating" ON public.prompt_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can select ratings" ON public.prompt_ratings FOR SELECT USING (true);

-- 4. Trigger function for ratings sync
CREATE OR REPLACE FUNCTION public.update_prompt_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts
  SET
    avg_rating = COALESCE((SELECT AVG(rating)::float8 FROM public.prompt_ratings WHERE prompt_id = NEW.prompt_id), 0),
    ratings_count = (SELECT COUNT(*) FROM public.prompt_ratings WHERE prompt_id = NEW.prompt_id)
  WHERE id = NEW.prompt_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all relevant operations
CREATE TRIGGER sync_prompt_rating_stats_insert
  AFTER INSERT ON public.prompt_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_prompt_rating_stats();

CREATE TRIGGER sync_prompt_rating_stats_update
  AFTER UPDATE ON public.prompt_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_prompt_rating_stats();

CREATE TRIGGER sync_prompt_rating_stats_delete
  AFTER DELETE ON public.prompt_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_prompt_rating_stats();

-- 5. Analytics view
CREATE OR REPLACE VIEW public.view_prompt_analytics AS
SELECT
  p.id AS prompt_id,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS ratings_count,
  COUNT(DISTINCT v.id) AS total_views,
  COUNT(DISTINCT CASE WHEN v.copied THEN v.id END) AS total_copies
FROM public.prompts p
LEFT JOIN public.prompt_ratings r ON p.id = r.prompt_id
LEFT JOIN public.prompt_views v ON p.id = v.prompt_id
GROUP BY p.id;
