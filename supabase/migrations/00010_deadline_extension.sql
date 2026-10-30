-- Extend the 2026 entry deadline from 30 October to 15 November 2026.
-- Public copy lives in site_settings; the seed in 00004 is historical and is
-- intentionally left unchanged. This migration updates the live values.

UPDATE public.site_settings AS s
SET value = v.value::jsonb,
    updated_at = now()
FROM (VALUES
  ('hero.fine',         '"Free to enter. Entries close November 15, 2026."'),
  ('dates.deadline_long',  '"November 15, 2026"'),
  ('dates.deadline_short', '"Nov 15"'),
  ('dates.deadline_full',  '"Sunday, 15 November 2026, 11:59 PM (WAT)"'),
  ('enter.hero_sub',       '"Entries close November 15, 2026."')
) AS v(key, value)
WHERE s.key = v.key;
