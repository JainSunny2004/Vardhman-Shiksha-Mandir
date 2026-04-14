ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS important BOOLEAN DEFAULT false;

UPDATE announcements
SET important = false
WHERE important IS NULL;
