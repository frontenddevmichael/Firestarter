-- Add draft status support for 2-level entry submission
-- Run this migration to update the entries table

-- 1. Change default status from 'submitted' to 'draft'
ALTER TABLE public.entries ALTER COLUMN status SET DEFAULT 'draft';

-- 2. Add check constraint for valid statuses
ALTER TABLE public.entries DROP CONSTRAINT IF EXISTS entries_status_check;
ALTER TABLE public.entries ADD CONSTRAINT entries_status_check 
  CHECK (status IN ('draft', 'submitted', 'shortlisted', 'finalist'));

-- 3. Add updated_at column to track last save time
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 4. Create trigger to auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_entries_updated_at ON public.entries;
CREATE TRIGGER update_entries_updated_at
  BEFORE UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();