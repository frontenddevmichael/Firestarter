-- One entry per entrant.
-- The dashboard loads a single entry with .single(); duplicate rows made that
-- lookup fail and left affected entrants unable to submit.
--
-- Keep the fullest poem per entrant (latest on ties). Production duplicates
-- were backed up first in backups.entries_dedup_20261027.
WITH ranked AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY entrant_id
           ORDER BY length(poem_text) DESC, updated_at DESC, id
         ) AS rn
  FROM public.entries
)
DELETE FROM public.entries e
USING ranked r
WHERE e.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS entries_entrant_id_key
  ON public.entries (entrant_id);
