-- ============================================================
-- VardhmanShikshaMandir CMS — Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- CORE CMS: every editable field on every public page
-- ────────────────────────────────────────────────────────────
CREATE TABLE content_blocks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page         TEXT        NOT NULL,
  section      TEXT        NOT NULL,
  field_key    TEXT        NOT NULL,
  value        TEXT,
  content_type TEXT        DEFAULT 'text',
  -- content_type: 'text' | 'richtext' | 'image' | 'boolean' | 'number' | 'json'
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section, field_key)
);

-- ────────────────────────────────────────────────────────────
-- REPEATING CONTENT (lists that grow)
-- ────────────────────────────────────────────────────────────
CREATE TABLE announcements (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  content    TEXT,
  date       DATE,
  active     BOOLEAN     DEFAULT true,
  sort_order INT         DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  event_date  DATE,
  image_url   TEXT,
  active      BOOLEAN     DEFAULT true,
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gallery_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  src_url     TEXT        NOT NULL,
  alt_text    TEXT,
  category    TEXT,
  sort_order  INT         DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faculty (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT    NOT NULL,
  designation   TEXT,
  qualification TEXT,
  department    TEXT,
  photo_url     TEXT,
  sort_order    INT     DEFAULT 0,
  active        BOOLEAN DEFAULT true
);

CREATE TABLE leadership (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  role          TEXT    NOT NULL,
  name          TEXT    NOT NULL,
  qualification TEXT,
  bio           TEXT,
  photo_url     TEXT,
  sort_order    INT     DEFAULT 0
);

CREATE TABLE mandatory_documents (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  file_url   TEXT,
  sort_order INT  DEFAULT 0
);

CREATE TABLE contact_submissions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  subject    TEXT,
  message    TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  read       BOOLEAN     DEFAULT false
);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

-- content_blocks: anon = SELECT; authenticated = full CRUD
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_blocks_anon_select"
  ON content_blocks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "content_blocks_auth_all"
  ON content_blocks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- announcements: anon = SELECT; authenticated = full CRUD
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_anon_select"
  ON announcements FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "announcements_auth_all"
  ON announcements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- events: anon = SELECT; authenticated = full CRUD
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_anon_select"
  ON events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "events_auth_all"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- gallery_images: anon = SELECT; authenticated = full CRUD
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_images_anon_select"
  ON gallery_images FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "gallery_images_auth_all"
  ON gallery_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- faculty: anon = SELECT; authenticated = full CRUD
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faculty_anon_select"
  ON faculty FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "faculty_auth_all"
  ON faculty FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- leadership: anon = SELECT; authenticated = full CRUD
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadership_anon_select"
  ON leadership FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "leadership_auth_all"
  ON leadership FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- mandatory_documents: anon = SELECT; authenticated = full CRUD
ALTER TABLE mandatory_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mandatory_documents_anon_select"
  ON mandatory_documents FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "mandatory_documents_auth_all"
  ON mandatory_documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- contact_submissions: anon = INSERT only; authenticated = SELECT + UPDATE
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_submissions_anon_insert"
  ON contact_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "contact_submissions_auth_select"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "contact_submissions_auth_update"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ────────────────────────────────────────────────────────────
-- STORAGE BUCKETS
-- Run each line individually if using Supabase Dashboard,
-- OR use the Storage UI to create buckets manually.
-- buckets: hero-images, gallery, faculty-photos,
--          leadership-photos, documents, misc
-- All: public read, authenticated write (set via Dashboard
--      Storage → Bucket → Policies after creation)
-- ────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('hero-images',       'hero-images',       true),
  ('gallery',           'gallery',           true),
  ('faculty-photos',    'faculty-photos',    true),
  ('leadership-photos', 'leadership-photos', true),
  ('documents',         'documents',         true),
  ('misc',              'misc',              true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: authenticated users can upload/delete; public can read
-- (Supabase storage objects table lives in the storage schema)
CREATE POLICY "storage_authenticated_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "storage_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "storage_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id IN (
    'hero-images', 'gallery', 'faculty-photos',
    'leadership-photos', 'documents', 'misc'
  ));
