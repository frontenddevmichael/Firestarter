-- =============================================================
-- Firestarter Young Poets Prize — Full Schema Migration
-- Target: new Supabase project (vhlylvqxrxmlirbjkchr)
-- =============================================================

-- 0. Extensions
-- gen_random_uuid() is built-in on modern Supabase (pgcrypto not needed for it)
-- We only need pgcrypto for crypt() / gen_salt() used in create_judge_user
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================
-- 1. TABLES
-- =============================================================

-- 1.1 profiles (auto-created by trigger on auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  full_name  text NOT NULL DEFAULT '',
  role       text NOT NULL DEFAULT 'entrant'
);

-- 1.2 entries
CREATE TABLE IF NOT EXISTS public.entries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrant_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  poem_text        text NOT NULL,
  video_link       text,
  voice_reflection text,
  category         text NOT NULL DEFAULT 'junior',
  status           text NOT NULL DEFAULT 'submitted',
  submitted_at     timestamptz NOT NULL DEFAULT now()
);

-- 1.3 guardians
CREATE TABLE IF NOT EXISTS public.guardians (
  entrant_id      uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  guardian_name   text NOT NULL,
  guardian_email  text NOT NULL,
  consent_given   boolean NOT NULL DEFAULT false
);

-- 1.4 judge_assignments
CREATE TABLE IF NOT EXISTS public.judge_assignments (
  entry_id  uuid NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  judge_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, judge_id)
);

-- 1.5 scores
CREATE TABLE IF NOT EXISTS public.scores (
  judge_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_id  uuid NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  score     integer NOT NULL CHECK (score >= 1 AND score <= 100),
  notes     text DEFAULT '',
  PRIMARY KEY (judge_id, entry_id)
);

-- 1.6 rounds
CREATE TABLE IF NOT EXISTS public.rounds (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase          text NOT NULL,
  phase_started  timestamptz NOT NULL DEFAULT now()
);

-- 1.7 email_logs
CREATE TABLE IF NOT EXISTS public.email_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient   text NOT NULL,
  email_type  text NOT NULL,
  status      text NOT NULL DEFAULT 'sent',
  sent_at     timestamptz NOT NULL DEFAULT now()
);

-- =============================================================
-- 2. TRIGGER FUNCTION — auto-create profiles on signup
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'entrant')
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- 3. RPC — create_judge_user
-- =============================================================

CREATE OR REPLACE FUNCTION public.create_judge_user(
  judge_email text,
  judge_password text,
  judge_name text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_id uuid;
  existing_email text;
BEGIN
  -- Check for existing email
  SELECT email INTO existing_email FROM auth.users WHERE email = judge_email;
  IF existing_email IS NOT NULL THEN
    RETURN jsonb_build_object('error', 'A user with this email already exists');
  END IF;

  new_id := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_user_meta_data, raw_app_meta_data, aud, role,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    created_at, updated_at
  )
  VALUES (
    new_id,
    '00000000-0000-0000-0000-000000000000',
    judge_email,
    crypt(judge_password, gen_salt('bf')),
    now(),
    jsonb_build_object('role', 'judge', 'full_name', judge_name),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    'authenticated',
    'authenticated',
    '', '', '', '',
    now(),
    now()
  );

  RETURN jsonb_build_object('id', new_id::text, 'email', judge_email);
END;
$function$;

-- =============================================================
-- 4. RPC — send_judge_credentials
-- =============================================================

CREATE OR REPLACE FUNCTION public.send_judge_credentials(
  judge_email text,
  judge_name text,
  judge_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Log the email (actual sending would be via Edge Function / pg_net / external SMTP)
  INSERT INTO public.email_logs (recipient, email_type, status)
  VALUES (judge_email, 'judge_credentials', 'sent');

  RETURN jsonb_build_object('success', true);
END;
$function$;

-- =============================================================
-- 5. RPC — delete_user (cascading)
-- =============================================================

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  uid uuid;
BEGIN
  uid := auth.uid();

  -- Delete child data (profiles cascade handles most via FK, but be explicit)
  DELETE FROM public.scores WHERE judge_id = uid OR entry_id IN (SELECT id FROM public.entries WHERE entrant_id = uid);
  DELETE FROM public.judge_assignments WHERE judge_id = uid OR entry_id IN (SELECT id FROM public.entries WHERE entrant_id = uid);
  DELETE FROM public.guardians WHERE entrant_id = uid;
  DELETE FROM public.entries WHERE entrant_id = uid;
  DELETE FROM public.profiles WHERE id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$function$;

-- =============================================================
-- 6. ROW-LEVEL SECURITY
-- =============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- --- profiles ---
-- Everyone authenticated can read all profiles (admin needs full list for judge dropdown, etc.)
CREATE POLICY "Profiles: authenticated read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Profiles: users update own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Insert is handled by trigger (SECURITY DEFINER), but allow service_role
CREATE POLICY "Profiles: service role insert"
  ON public.profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- --- entries ---
-- Entrants can read their own entry
CREATE POLICY "Entries: entrant read own"
  ON public.entries FOR SELECT
  TO authenticated
  USING (entrant_id = auth.uid());

-- Entrants can insert their own entry
CREATE POLICY "Entries: entrant insert own"
  ON public.entries FOR INSERT
  TO authenticated
  WITH CHECK (entrant_id = auth.uid());

-- Entrants can update their own entry (for withdrawal)
CREATE POLICY "Entries: entrant update own"
  ON public.entries FOR UPDATE
  TO authenticated
  USING (entrant_id = auth.uid());

-- Admins can do everything (using a helper to check role)
CREATE POLICY "Entries: admin full access"
  ON public.entries FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Judges can read entries they are assigned to
CREATE POLICY "Entries: judge read assigned"
  ON public.entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.judge_assignments
      WHERE judge_assignments.entry_id = entries.id
      AND judge_assignments.judge_id = auth.uid()
    )
  );

-- Service role full access (for RPCs)
CREATE POLICY "Entries: service role full"
  ON public.entries FOR ALL
  TO service_role
  WITH CHECK (true);

-- --- guardians ---
CREATE POLICY "Guardians: entrant read own"
  ON public.guardians FOR SELECT
  TO authenticated
  USING (entrant_id = auth.uid());

CREATE POLICY "Guardians: entrant insert own"
  ON public.guardians FOR INSERT
  TO authenticated
  WITH CHECK (entrant_id = auth.uid());

CREATE POLICY "Guardians: admin read all"
  ON public.guardians FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Guardians: service role full"
  ON public.guardians FOR ALL
  TO service_role
  WITH CHECK (true);

-- --- judge_assignments ---
CREATE POLICY "Judge assignments: judge read own"
  ON public.judge_assignments FOR SELECT
  TO authenticated
  USING (judge_id = auth.uid());

CREATE POLICY "Judge assignments: admin full access"
  ON public.judge_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Judge assignments: service role full"
  ON public.judge_assignments FOR ALL
  TO service_role
  WITH CHECK (true);

-- --- scores ---
CREATE POLICY "Scores: judge read own"
  ON public.scores FOR SELECT
  TO authenticated
  USING (judge_id = auth.uid());

CREATE POLICY "Scores: judge upsert own"
  ON public.scores FOR INSERT
  TO authenticated
  WITH CHECK (judge_id = auth.uid());

CREATE POLICY "Scores: judge update own"
  ON public.scores FOR UPDATE
  TO authenticated
  USING (judge_id = auth.uid());

CREATE POLICY "Scores: admin read all"
  ON public.scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Scores: service role full"
  ON public.scores FOR ALL
  TO service_role
  WITH CHECK (true);

-- --- rounds ---
CREATE POLICY "Rounds: authenticated read"
  ON public.rounds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Rounds: admin insert"
  ON public.rounds FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Rounds: service role full"
  ON public.rounds FOR ALL
  TO service_role
  WITH CHECK (true);

-- --- email_logs ---
CREATE POLICY "Email logs: admin read"
  ON public.email_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Email logs: service role full"
  ON public.email_logs FOR ALL
  TO service_role
  WITH CHECK (true);
