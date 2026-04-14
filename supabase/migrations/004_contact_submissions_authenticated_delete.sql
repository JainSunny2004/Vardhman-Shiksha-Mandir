DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_submissions'
      AND policyname = 'contact_submissions_auth_delete'
  ) THEN
    CREATE POLICY "contact_submissions_auth_delete"
      ON contact_submissions FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;
