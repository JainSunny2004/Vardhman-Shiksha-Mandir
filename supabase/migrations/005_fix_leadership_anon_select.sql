-- Ensure anon role can SELECT from leadership (public About page)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'leadership'
      AND policyname = 'leadership_anon_select'
  ) THEN
    CREATE POLICY "leadership_anon_select"
      ON leadership FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;
