-- Phase 1 Site Content CMS: admin-editable prize-site copy.
-- Public read, admin-only write. Seeded with the live copy; re-runnable safely
-- (ON CONFLICT DO NOTHING never overwrites admin edits).

CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings: public read" ON public.site_settings;
CREATE POLICY "Site settings: public read"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Site settings: admin write" ON public.site_settings;
CREATE POLICY "Site settings: admin write"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Site settings: service role full" ON public.site_settings;
CREATE POLICY "Site settings: service role full"
  ON public.site_settings FOR ALL
  TO service_role
  WITH CHECK (true);

-- Seeds: today's live copy (jsonb raw values: strings and booleans).
INSERT INTO public.site_settings (key, value) VALUES
  ('hero.eyebrow', '"The Firestarter Young Poets Prize 2026"'),
  ('hero.title_a', '"My Voice,"'),
  ('hero.title_b', '"My Future."'),
  ('hero.sub', '"For secondary school students across Lagos State, ages 10 to 17. Write one original poem. Share the thinking behind it. Build original thinking, confident communication and the responsible use of technology, through poetry, reflection and spoken-word performance."'),
  ('hero.fine', '"Free to enter. Entries close October 30, 2026."'),
  ('hero.cta_enter', '"Enter now"'),
  ('hero.cta_pack', '"Download the Spark Pack"'),
  ('hero.final_title', '"Every voice begins somewhere."'),
  ('hero.final_sub', '"This could be where yours begins."'),
  ('theme.name', '"My Voice, My Future"'),
  ('theme.title', '"My Voice, My Future."'),
  ('theme.desc', '"Every generation inherits a world shaped by the voices that came before it. The future will be shaped by the voices that speak today. Yours is one of them. Write honestly. Imagine boldly. Use your words to help shape the future you want to see."'),
  ('dates.deadline_long', '"October 30, 2026"'),
  ('dates.deadline_short', '"Oct 30"'),
  ('dates.deadline_full', '"Friday, 30 October 2026, 11:59 PM (WAT)"'),
  ('dates.judging', '"November"'),
  ('dates.lab', '"Early Dec"'),
  ('dates.final', '"December"'),
  ('dates.videos_due', '"Late November"'),
  ('prize.first', '"₦1,000,000"'),
  ('prize.second', '"₦500,000"'),
  ('prize.third', '"₦250,000"'),
  ('prize.rest', '"₦50,000"'),
  ('prize.top100', '"certificates, recognition, a place at the Creative-Tech Lab, and a spot at the December grand final"'),
  ('spark.closing', '"Now go write something only you could have written."'),
  ('enter.hero_sub', '"Entries close October 30, 2026."'),
  ('enter.card_desc', '"Create your free account to get your personal dashboard. Explore the Spark Pack, save a draft, and submit your poem whenever you are ready — your guardian verifies with an email code before anything is submitted."'),
  ('community.whatsapp_link', '"https://chat.whatsapp.com/EDm92HpP6k26FCbvWq5V7P"'),
  ('community.whatsapp_count', '"200+"'),
  ('contact.email', '"contactfirestartermethod@gmail.com"'),
  ('show.prizes', 'true'),
  ('show.countdown', 'true'),
  ('show.whatsapp', 'true')
ON CONFLICT (key) DO NOTHING;

-- Harden profiles.role: only service_role / postgres may change it.
-- Closes the entrant self-promotion hole (update-own policy has no column guard).
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (
      current_user IN ('postgres', 'service_role', 'supabase_admin')
      OR (auth.jwt() ->> 'role') = 'service_role'
    ) THEN
      RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profiles_role ON public.profiles;
CREATE TRIGGER protect_profiles_role
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();
