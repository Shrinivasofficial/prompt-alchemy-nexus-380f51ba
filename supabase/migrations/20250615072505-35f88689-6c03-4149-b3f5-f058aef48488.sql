
-- Enable RLS on prompts table if not yet enabled
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Allow prompt owners to delete their own prompts
CREATE POLICY "Prompt owners can delete" ON public.prompts
  FOR DELETE
  USING (auth.uid() = created_by);
