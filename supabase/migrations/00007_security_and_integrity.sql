-- =============================================================
-- 00007 — Security and integrity fixes
--
-- 1. Judge-account creation is admin-only (was callable by anyone).
-- 2. Profiles are no longer readable by every signed-in user.
-- 3. Entrants cannot self-promote an entry status or submit without
--    a verified guardian consent, and submitted entries are locked.
-- 4. 'withdrawn' is allowed by the entries status constraint.
-- 5. Signup can no longer choose its own role via auth metadata.
-- 6. Consent rows can no longer be written by the entrant.
--
-- Apply with: supabase db push  (or run in the SQL editor)
-- =============================================================

-- -------------------------------------------------------------
-- 1. Admin check helper (SECURITY DEFINER avoids RLS recursion when
--    a policy on public.profiles needs to read public.profiles).
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- -------------------------------------------------------------
-- 2. create_judge_user: admin-only + locked-down EXECUTE grants
-- -------------------------------------------------------------
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
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can create judge accounts';
  END IF;

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

  -- handle_new_user creates every new signup as an entrant; promote this one.
  UPDATE public.profiles SET role = 'judge' WHERE id = new_id;

  RETURN jsonb_build_object('id', new_id::text, 'email', judge_email);
END;
$function$;

REVOKE ALL ON FUNCTION public.create_judge_user(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_judge_user(text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_judge_user(text, text, text) TO authenticated;

-- send_judge_credentials only logs an email; it is unused by the client
-- and must never be callable by end users.
REVOKE ALL ON FUNCTION public.send_judge_credentials(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.send_judge_credentials(text, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.send_judge_credentials(text, text, text) FROM authenticated;

-- -------------------------------------------------------------
-- 3. Profiles: own row or admin only (entrant names/emails were
--    exposed to every signed-in user).
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles: authenticated read all" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: read own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: admin read all" ON public.profiles;

CREATE POLICY "Profiles: read own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Profiles: admin read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- -------------------------------------------------------------
-- 4. entries: allow 'withdrawn' (admin withdraw was failing with a
--    check-constraint violation).
-- -------------------------------------------------------------
ALTER TABLE public.entries DROP CONSTRAINT IF EXISTS entries_status_check;
ALTER TABLE public.entries ADD CONSTRAINT entries_status_check
  CHECK (status IN ('draft', 'submitted', 'shortlisted', 'finalist', 'withdrawn'));

-- -------------------------------------------------------------
-- 5. Entry rules enforced in the database, not just the UI:
--    - an entrant cannot set shortlisted/finalist/withdrawn
--    - an entrant cannot submit without a verified guardian consent
--    - a submitted entry is locked against further entrant edits
--    Admin and service_role actions are unaffected.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_entry_rules()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Only constrain actions performed by the entrant themself.
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM NEW.entrant_id THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status <> 'draft' THEN
    RAISE EXCEPTION 'This entry has been submitted and is locked';
  END IF;

  IF NEW.status IN ('shortlisted', 'finalist', 'withdrawn') THEN
    RAISE EXCEPTION 'Only administrators can set this entry status';
  END IF;

  IF NEW.status = 'submitted' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.guardian_consents
      WHERE entrant_id = NEW.entrant_id AND verified_at IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Guardian consent must be verified before submitting';
    END IF;
    NEW.guardian_consent_verified := true;
  ELSIF NEW.guardian_consent_verified AND NOT EXISTS (
    SELECT 1 FROM public.guardian_consents
    WHERE entrant_id = NEW.entrant_id AND verified_at IS NOT NULL
  ) THEN
    NEW.guardian_consent_verified := false;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_entry_rules ON public.entries;
CREATE TRIGGER enforce_entry_rules
  BEFORE INSERT OR UPDATE ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_entry_rules();

-- -------------------------------------------------------------
-- 6. Signup must not be able to choose its own role.
--    The original trigger trusted raw_user_meta_data->>'role', so anyone
--    could call the auth signup endpoint with {"role":"admin"} and get an
--    admin profile. Every new signup is now an entrant; judge accounts are
--    promoted explicitly by create_judge_user, and admins are set by hand.
-- -------------------------------------------------------------
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
    'entrant'
  );
  RETURN NEW;
END;
$$;

-- -------------------------------------------------------------
-- 7. Consent rows are written only by the verified Edge Functions
--    (service_role). Previously an entrant could update their own
--    guardian_consents row and set verified_at, or insert a guardians row
--    with consent_given = true — bypassing the guardian gate entirely.
--    Entrants keep read access for the dashboard.
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Guardian consents: entrant insert own" ON public.guardian_consents;
DROP POLICY IF EXISTS "Guardian consents: entrant update own" ON public.guardian_consents;

DROP POLICY IF EXISTS "Guardians: entrant insert own" ON public.guardians;
DROP POLICY IF EXISTS "Guardians: entrant update own" ON public.guardians;
