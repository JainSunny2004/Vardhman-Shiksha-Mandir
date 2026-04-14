DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_submissions'
      AND policyname = 'contact_submissions_auth_insert'
  ) THEN
    CREATE POLICY "contact_submissions_auth_insert"
      ON contact_submissions FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;
