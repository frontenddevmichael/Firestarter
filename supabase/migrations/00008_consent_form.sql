-- =============================================================
-- 00008 — Participant Commitment & Parental Consent Form
--
-- Records the specific consents from the signed form on the same
-- guardian_consents row that already holds the email verification:
--   child commitment, safeguarding policy, event supervision,
--   poem publication, and photography consent / opt-out.
--
-- consented_at is set only when the guardian verifies the emailed code,
-- which is the point at which the consent is actually given.
--
-- Apply after 00007:  supabase db push
-- =============================================================

ALTER TABLE public.guardian_consents
  ADD COLUMN IF NOT EXISTS child_commitment      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS policy_accepted       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS supervision_confirmed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publication_consent   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS media_consent         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS media_opt_out         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consented_at          timestamptz,
  ADD COLUMN IF NOT EXISTS consent_version       text NOT NULL DEFAULT '2026-10';

-- A guardian cannot both consent to and opt out of photography.
ALTER TABLE public.guardian_consents
  DROP CONSTRAINT IF EXISTS guardian_consents_media_choice_check;

ALTER TABLE public.guardian_consents
  ADD CONSTRAINT guardian_consents_media_choice_check
  CHECK (NOT (media_consent AND media_opt_out));

-- Admin reporting: quickly find media opt-outs.
CREATE INDEX IF NOT EXISTS guardian_consents_media_opt_out_idx
  ON public.guardian_consents (media_opt_out)
  WHERE media_opt_out = true;
