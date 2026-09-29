-- Guardian email-code verification for dashboard-first entry flow
-- Entrants sign up to a dashboard first; final poem submission requires
-- a 6-digit code sent to the guardian's email (30-min expiry, 5 attempts max).

-- 1. guardian_consents table (one row per entrant, code hashes only)
CREATE TABLE IF NOT EXISTS public.guardian_consents (
  entrant_id     uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  guardian_name  text NOT NULL DEFAULT '',
  guardian_email text NOT NULL DEFAULT '',
  code_hash      text NOT NULL DEFAULT '',
  expires_at     timestamptz,
  attempts       integer NOT NULL DEFAULT 0,
  verified_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- 2. entries: gate final submit on verified guardian consent
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS guardian_consent_verified boolean NOT NULL DEFAULT false;

-- 3. guardians: allow entrants to update own row (email change / re-verify path)
-- (Insert/select policies already exist from 00001; verify edge fn uses service_role.)
DROP POLICY IF EXISTS "Guardians: entrant update own" ON public.guardians;
CREATE POLICY "Guardians: entrant update own"
  ON public.guardians FOR UPDATE
  TO authenticated
  USING (entrant_id = auth.uid())
  WITH CHECK (entrant_id = auth.uid());

-- 4. RLS for guardian_consents
ALTER TABLE public.guardian_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guardian consents: entrant read own" ON public.guardian_consents;
CREATE POLICY "Guardian consents: entrant read own"
  ON public.guardian_consents FOR SELECT
  TO authenticated
  USING (entrant_id = auth.uid());

DROP POLICY IF EXISTS "Guardian consents: entrant insert own" ON public.guardian_consents;
CREATE POLICY "Guardian consents: entrant insert own"
  ON public.guardian_consents FOR INSERT
  TO authenticated
  WITH CHECK (entrant_id = auth.uid());

DROP POLICY IF EXISTS "Guardian consents: entrant update own" ON public.guardian_consents;
CREATE POLICY "Guardian consents: entrant update own"
  ON public.guardian_consents FOR UPDATE
  TO authenticated
  USING (entrant_id = auth.uid())
  WITH CHECK (entrant_id = auth.uid());

DROP POLICY IF EXISTS "Guardian consents: admin read all" ON public.guardian_consents;
CREATE POLICY "Guardian consents: admin read all"
  ON public.guardian_consents FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Guardian consents: service role full" ON public.guardian_consents;
CREATE POLICY "Guardian consents: service role full"
  ON public.guardian_consents FOR ALL
  TO service_role
  WITH CHECK (true);
