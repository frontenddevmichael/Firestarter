-- =============================================================
-- 00011 — School portal
--
-- One school, many students who do not have email accounts.
-- Students are real records (`school_students`) but are not auth users.
-- An entry belongs to either an individual entrant (`entrant_id`) or a
-- school student (`school_student_id`) — never both.
--
-- This migration:
--   1. Adds schools, staff links, students, and school consent records.
--   2. Makes entries.entrant_id nullable and adds school_student_id.
--   3. Adds school-scoped RLS and SECURITY DEFINER helpers.
--   4. Extends the entry trigger to enforce school consent and locks.
--   5. Adds RPCs for saving a student, bulk import, and results.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Tables
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schools (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  slug             text UNIQUE,
  contact_name     text NOT NULL DEFAULT '',
  contact_email    text NOT NULL DEFAULT '',
  results_visible  boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.school_members (
  user_id    uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id  uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS school_members_school_id_idx
  ON public.school_members (school_id);

CREATE TABLE IF NOT EXISTS public.school_students (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  full_name       text NOT NULL,
  category        text NOT NULL DEFAULT 'junior'
                    CHECK (category IN ('junior', 'senior')),
  student_ref     text,
  guardian_name   text NOT NULL DEFAULT '',
  guardian_email  text NOT NULL DEFAULT '',
  media_consent   boolean NOT NULL DEFAULT false,
  media_opt_out   boolean NOT NULL DEFAULT false,
  claimed_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  claimed_at      timestamptz,
  created_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT school_students_media_choice_check
    CHECK (NOT (media_consent AND media_opt_out))
);
CREATE INDEX IF NOT EXISTS school_students_school_id_idx
  ON public.school_students (school_id);
CREATE UNIQUE INDEX IF NOT EXISTS school_students_school_ref_key
  ON public.school_students (school_id, student_ref)
  WHERE student_ref IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.school_student_consents (
  student_id            uuid PRIMARY KEY REFERENCES public.school_students(id) ON DELETE CASCADE,
  guardian_name         text NOT NULL DEFAULT '',
  guardian_email        text NOT NULL DEFAULT '',
  child_commitment      boolean NOT NULL DEFAULT false,
  policy_accepted       boolean NOT NULL DEFAULT false,
  supervision_confirmed boolean NOT NULL DEFAULT false,
  publication_consent   boolean NOT NULL DEFAULT false,
  media_consent         boolean NOT NULL DEFAULT false,
  media_opt_out         boolean NOT NULL DEFAULT false,
  consent_source        text NOT NULL DEFAULT 'school_paper'
                          CHECK (consent_source IN ('school_paper', 'guardian_email', 'digital_form')),
  consent_reference     text NOT NULL DEFAULT '',
  consent_version       text NOT NULL DEFAULT '2026-10',
  verified_at           timestamptz,
  consented_at          timestamptz,
  verified_by           uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by           uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT school_student_consents_media_choice_check
    CHECK (NOT (media_consent AND media_opt_out)),
  CONSTRAINT school_student_consents_verified_check
    CHECK (verified_at IS NULL OR (child_commitment AND policy_accepted AND supervision_confirmed))
);
CREATE INDEX IF NOT EXISTS school_student_consents_media_opt_out_idx
  ON public.school_student_consents (media_opt_out)
  WHERE media_opt_out = true;

-- -------------------------------------------------------------
-- 2. Entries: one owner, either an entrant or a school student
-- -------------------------------------------------------------
ALTER TABLE public.entries
  ALTER COLUMN entrant_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS school_student_id uuid
    REFERENCES public.school_students(id) ON DELETE CASCADE;

ALTER TABLE public.entries DROP CONSTRAINT IF EXISTS entries_owner_check;
ALTER TABLE public.entries ADD CONSTRAINT entries_owner_check
  CHECK (
    (entrant_id IS NOT NULL AND school_student_id IS NULL)
    OR (entrant_id IS NULL AND school_student_id IS NOT NULL)
  );

-- A full unique index permits many NULLs but only one entry per school
-- student. It can be inferred by PostgREST's on_conflict=school_student_id.
CREATE UNIQUE INDEX IF NOT EXISTS entries_school_student_id_key
  ON public.entries (school_student_id);
CREATE INDEX IF NOT EXISTS entries_school_student_id_idx
  ON public.entries (school_student_id);

-- -------------------------------------------------------------
-- 3. Helpers
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_school_member(p_school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.school_members
    WHERE user_id = auth.uid() AND school_id = p_school_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_school_member_for_student(p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.school_students ss
    JOIN public.school_members sm ON sm.school_id = ss.school_id
    WHERE ss.id = p_student_id AND sm.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_school_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_school_member(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_school_member(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_school_member_for_student(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_school_member_for_student(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_school_member_for_student(uuid) TO authenticated;

-- -------------------------------------------------------------
-- 4. RLS
-- -------------------------------------------------------------
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_student_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Schools: member read" ON public.schools;
CREATE POLICY "Schools: member read"
  ON public.schools FOR SELECT
  TO authenticated
  USING (public.is_school_member(id));

DROP POLICY IF EXISTS "Schools: admin full" ON public.schools;
CREATE POLICY "Schools: admin full"
  ON public.schools FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Schools: service role full" ON public.schools;
CREATE POLICY "Schools: service role full"
  ON public.schools FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "School members: read own school" ON public.school_members;
CREATE POLICY "School members: read own school"
  ON public.school_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_school_member(school_id));

DROP POLICY IF EXISTS "School members: admin full" ON public.school_members;
CREATE POLICY "School members: admin full"
  ON public.school_members FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "School members: service role full" ON public.school_members;
CREATE POLICY "School members: service role full"
  ON public.school_members FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "School students: member read" ON public.school_students;
CREATE POLICY "School students: member read"
  ON public.school_students FOR SELECT
  TO authenticated
  USING (public.is_school_member(school_id));

DROP POLICY IF EXISTS "School students: member insert" ON public.school_students;
CREATE POLICY "School students: member insert"
  ON public.school_students FOR INSERT
  TO authenticated
  WITH CHECK (public.is_school_member(school_id));

DROP POLICY IF EXISTS "School students: member update" ON public.school_students;
CREATE POLICY "School students: member update"
  ON public.school_students FOR UPDATE
  TO authenticated
  USING (public.is_school_member(school_id))
  WITH CHECK (public.is_school_member(school_id));

DROP POLICY IF EXISTS "School students: admin full" ON public.school_students;
CREATE POLICY "School students: admin full"
  ON public.school_students FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "School students: service role full" ON public.school_students;
CREATE POLICY "School students: service role full"
  ON public.school_students FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "School student consents: member read" ON public.school_student_consents;
CREATE POLICY "School student consents: member read"
  ON public.school_student_consents FOR SELECT
  TO authenticated
  USING (public.is_school_member_for_student(student_id));

DROP POLICY IF EXISTS "School student consents: member insert" ON public.school_student_consents;
CREATE POLICY "School student consents: member insert"
  ON public.school_student_consents FOR INSERT
  TO authenticated
  WITH CHECK (public.is_school_member_for_student(student_id));

DROP POLICY IF EXISTS "School student consents: member update" ON public.school_student_consents;
CREATE POLICY "School student consents: member update"
  ON public.school_student_consents FOR UPDATE
  TO authenticated
  USING (public.is_school_member_for_student(student_id))
  WITH CHECK (public.is_school_member_for_student(student_id));

DROP POLICY IF EXISTS "School student consents: admin full" ON public.school_student_consents;
CREATE POLICY "School student consents: admin full"
  ON public.school_student_consents FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "School student consents: service role full" ON public.school_student_consents;
CREATE POLICY "School student consents: service role full"
  ON public.school_student_consents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Entries: school read" ON public.entries;
CREATE POLICY "Entries: school read"
  ON public.entries FOR SELECT
  TO authenticated
  USING (
    school_student_id IS NOT NULL
    AND public.is_school_member_for_student(school_student_id)
  );

DROP POLICY IF EXISTS "Entries: school insert" ON public.entries;
CREATE POLICY "Entries: school insert"
  ON public.entries FOR INSERT
  TO authenticated
  WITH CHECK (
    entrant_id IS NULL
    AND school_student_id IS NOT NULL
    AND public.is_school_member_for_student(school_student_id)
  );

DROP POLICY IF EXISTS "Entries: school update" ON public.entries;
CREATE POLICY "Entries: school update"
  ON public.entries FOR UPDATE
  TO authenticated
  USING (
    school_student_id IS NOT NULL
    AND public.is_school_member_for_student(school_student_id)
  )
  WITH CHECK (
    school_student_id IS NOT NULL
    AND public.is_school_member_for_student(school_student_id)
  );

-- -------------------------------------------------------------
-- 5. Updated-at triggers
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS update_schools_updated_at ON public.schools;
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_school_students_updated_at ON public.school_students;
CREATE TRIGGER update_school_students_updated_at
  BEFORE UPDATE ON public.school_students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_school_student_consents_updated_at ON public.school_student_consents;
CREATE TRIGGER update_school_student_consents_updated_at
  BEFORE UPDATE ON public.school_student_consents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------
-- 6. Entry rules: school entries get the same consent and lock rules
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_entry_rules()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  is_service_user boolean := auth.uid() IS NULL;
  is_admin_user   boolean := public.is_admin();
  is_school_entry boolean := NEW.school_student_id IS NOT NULL;
  school_member   boolean := false;
  consent_ok      boolean := false;
BEGIN
  -- Service role and admins are not constrained here.
  IF is_service_user OR is_admin_user THEN
    RETURN NEW;
  END IF;

  IF is_school_entry THEN
    school_member := public.is_school_member_for_student(NEW.school_student_id);
    IF NOT school_member THEN
      RAISE EXCEPTION 'You do not have access to this school student';
    END IF;

    IF TG_OP = 'UPDATE' THEN
      IF OLD.school_student_id IS DISTINCT FROM NEW.school_student_id
         OR OLD.entrant_id IS DISTINCT FROM NEW.entrant_id THEN
        RAISE EXCEPTION 'Entry ownership cannot be changed';
      END IF;
      IF OLD.status <> 'draft' THEN
        RAISE EXCEPTION 'This entry has been submitted and is locked';
      END IF;
    END IF;

    IF NEW.status IN ('shortlisted', 'finalist', 'withdrawn') THEN
      RAISE EXCEPTION 'Only administrators can set this entry status';
    END IF;

    SELECT EXISTS (
      SELECT 1
      FROM public.school_student_consents
      WHERE student_id = NEW.school_student_id AND verified_at IS NOT NULL
    ) INTO consent_ok;

    IF NEW.status = 'submitted' THEN
      IF NOT consent_ok THEN
        RAISE EXCEPTION 'Guardian consent must be verified before submitting';
      END IF;
      NEW.guardian_consent_verified := true;
    ELSIF NEW.guardian_consent_verified AND NOT consent_ok THEN
      NEW.guardian_consent_verified := false;
    END IF;

    RETURN NEW;
  END IF;

  -- Individual entrant path (unchanged behaviour).
  IF auth.uid() IS DISTINCT FROM NEW.entrant_id THEN
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

-- Do not let a school user remove verified consent for a submitted entry.
CREATE OR REPLACE FUNCTION public.protect_school_consent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_admin() THEN
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF EXISTS (
      SELECT 1 FROM public.entries
      WHERE school_student_id = OLD.student_id AND status <> 'draft'
    ) THEN
      RAISE EXCEPTION 'Cannot remove consent for a submitted entry';
    END IF;
    RETURN OLD;
  END IF;

  IF OLD.verified_at IS NOT NULL AND NEW.verified_at IS NULL AND EXISTS (
    SELECT 1 FROM public.entries
    WHERE school_student_id = NEW.student_id AND status <> 'draft'
  ) THEN
    RAISE EXCEPTION 'Cannot remove verified consent for a submitted entry';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_school_consent ON public.school_student_consents;
CREATE TRIGGER protect_school_consent
  BEFORE UPDATE OR DELETE ON public.school_student_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_school_consent();

-- -------------------------------------------------------------
-- 7. Save one student + consent (add/edit)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.school_save_student(
  p_student_id uuid,
  p_full_name text,
  p_category text,
  p_guardian_name text,
  p_guardian_email text,
  p_media_consent boolean,
  p_media_opt_out boolean,
  p_consent_confirmed boolean,
  p_consent_reference text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_school_id  uuid;
  v_student_id uuid;
  v_confirmed  boolean := COALESCE(p_consent_confirmed, false);
  v_media      boolean := COALESCE(p_media_consent, false);
  v_opt_out    boolean := COALESCE(p_media_opt_out, false);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF p_full_name IS NULL OR length(btrim(p_full_name)) = 0 THEN
    RAISE EXCEPTION 'Student name is required';
  END IF;
  IF p_category IS NULL OR p_category NOT IN ('junior', 'senior') THEN
    RAISE EXCEPTION 'Category must be junior or senior';
  END IF;
  IF v_media AND v_opt_out THEN
    RAISE EXCEPTION 'Choose media consent or opt-out, not both';
  END IF;
  IF v_confirmed AND (p_guardian_name IS NULL OR length(btrim(p_guardian_name)) = 0) THEN
    RAISE EXCEPTION 'Guardian name is required when confirming consent';
  END IF;

  IF p_student_id IS NULL THEN
    SELECT school_id INTO v_school_id
    FROM public.school_members
    WHERE user_id = auth.uid()
    ORDER BY created_at
    LIMIT 1;

    IF v_school_id IS NULL THEN
      RAISE EXCEPTION 'No school is linked to this account';
    END IF;

    INSERT INTO public.school_students
      (school_id, full_name, category, guardian_name, guardian_email,
       media_consent, media_opt_out, created_by)
    VALUES
      (v_school_id, btrim(p_full_name), p_category, COALESCE(p_guardian_name, ''),
       COALESCE(p_guardian_email, ''), v_media, v_opt_out, auth.uid())
    RETURNING id INTO v_student_id;
  ELSE
    SELECT school_id INTO v_school_id
    FROM public.school_students
    WHERE id = p_student_id;

    IF v_school_id IS NULL OR NOT public.is_school_member(v_school_id) THEN
      RAISE EXCEPTION 'Student not found for this school';
    END IF;

    UPDATE public.school_students
    SET full_name = btrim(p_full_name),
        category = p_category,
        guardian_name = COALESCE(p_guardian_name, ''),
        guardian_email = COALESCE(p_guardian_email, ''),
        media_consent = v_media,
        media_opt_out = v_opt_out
    WHERE id = p_student_id AND school_id = v_school_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Student not found for this school';
    END IF;
    v_student_id := p_student_id;
  END IF;

  INSERT INTO public.school_student_consents
    (student_id, guardian_name, guardian_email, child_commitment,
     policy_accepted, supervision_confirmed, publication_consent,
     media_consent, media_opt_out, consent_source, consent_reference,
     verified_at, consented_at, verified_by)
  VALUES
    (v_student_id, COALESCE(p_guardian_name, ''), COALESCE(p_guardian_email, ''),
     v_confirmed, v_confirmed, v_confirmed, v_confirmed,
     v_media, v_opt_out, 'school_paper', COALESCE(p_consent_reference, ''),
     CASE WHEN v_confirmed THEN now() END,
     CASE WHEN v_confirmed THEN now() END,
     CASE WHEN v_confirmed THEN auth.uid() END)
  ON CONFLICT (student_id) DO UPDATE SET
    guardian_name = EXCLUDED.guardian_name,
    guardian_email = EXCLUDED.guardian_email,
    child_commitment = EXCLUDED.child_commitment,
    policy_accepted = EXCLUDED.policy_accepted,
    supervision_confirmed = EXCLUDED.supervision_confirmed,
    publication_consent = EXCLUDED.publication_consent,
    media_consent = EXCLUDED.media_consent,
    media_opt_out = EXCLUDED.media_opt_out,
    consent_source = EXCLUDED.consent_source,
    consent_reference = EXCLUDED.consent_reference,
    verified_at = EXCLUDED.verified_at,
    consented_at = EXCLUDED.consented_at,
    verified_by = EXCLUDED.verified_by,
    updated_at = now();

  RETURN v_student_id;
END;
$$;

REVOKE ALL ON FUNCTION public.school_save_student(uuid, text, text, text, text, boolean, boolean, boolean, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.school_save_student(uuid, text, text, text, text, boolean, boolean, boolean, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.school_save_student(uuid, text, text, text, text, boolean, boolean, boolean, text) TO authenticated;

-- -------------------------------------------------------------
-- 8. Bulk import (CSV rows -> students + consents + draft/submitted entries)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.school_bulk_import(
  p_students jsonb,
  p_submit boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_school_id  uuid;
  v_row        jsonb;
  v_student_id uuid;
  v_count      integer := 0;
  v_confirmed  boolean;
  v_media      boolean;
  v_opt_out    boolean;
  v_category   text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF p_students IS NULL OR jsonb_typeof(p_students) <> 'array' THEN
    RAISE EXCEPTION 'Expected a JSON array of students';
  END IF;
  IF jsonb_array_length(p_students) > 200 THEN
    RAISE EXCEPTION 'Import is limited to 200 students at a time';
  END IF;

  SELECT school_id INTO v_school_id
  FROM public.school_members
  WHERE user_id = auth.uid()
  ORDER BY created_at
  LIMIT 1;

  IF v_school_id IS NULL THEN
    RAISE EXCEPTION 'No school is linked to this account';
  END IF;

  FOR v_row IN SELECT * FROM jsonb_array_elements(p_students)
  LOOP
    v_category := COALESCE(v_row ->> 'category', 'junior');
    v_confirmed := COALESCE(NULLIF(v_row ->> 'consent_confirmed', '')::boolean, false);
    v_media := COALESCE(NULLIF(v_row ->> 'media_consent', '')::boolean, false);
    v_opt_out := COALESCE(NULLIF(v_row ->> 'media_opt_out', '')::boolean, false);

    IF v_row ->> 'full_name' IS NULL OR length(btrim(v_row ->> 'full_name')) = 0 THEN
      RAISE EXCEPTION 'Every student needs a name';
    END IF;
    IF v_category NOT IN ('junior', 'senior') THEN
      RAISE EXCEPTION 'Invalid category for %', v_row ->> 'full_name';
    END IF;
    IF v_row ->> 'poem_text' IS NULL OR length(btrim(v_row ->> 'poem_text')) = 0 THEN
      RAISE EXCEPTION 'Every student needs a poem';
    END IF;
    IF v_media AND v_opt_out THEN
      RAISE EXCEPTION 'Media consent conflict for %', v_row ->> 'full_name';
    END IF;
    IF p_submit AND NOT v_confirmed THEN
      RAISE EXCEPTION 'Consent must be confirmed before submitting %', v_row ->> 'full_name';
    END IF;

    INSERT INTO public.school_students
      (school_id, full_name, category, student_ref, guardian_name,
       guardian_email, media_consent, media_opt_out, created_by)
    VALUES
      (v_school_id, btrim(v_row ->> 'full_name'), v_category,
       NULLIF(btrim(COALESCE(v_row ->> 'student_ref', '')), ''),
       COALESCE(v_row ->> 'guardian_name', ''),
       COALESCE(v_row ->> 'guardian_email', ''),
       v_media, v_opt_out, auth.uid())
    RETURNING id INTO v_student_id;

    INSERT INTO public.school_student_consents
      (student_id, guardian_name, guardian_email, child_commitment,
       policy_accepted, supervision_confirmed, publication_consent,
       media_consent, media_opt_out, consent_source, consent_reference,
       verified_at, consented_at, verified_by)
    VALUES
      (v_student_id, COALESCE(v_row ->> 'guardian_name', ''),
       COALESCE(v_row ->> 'guardian_email', ''),
       v_confirmed, v_confirmed, v_confirmed, v_confirmed,
       v_media, v_opt_out, 'school_paper',
       COALESCE(v_row ->> 'consent_reference', ''),
       CASE WHEN v_confirmed THEN now() END,
       CASE WHEN v_confirmed THEN now() END,
       CASE WHEN v_confirmed THEN auth.uid() END);

    INSERT INTO public.entries
      (entrant_id, school_student_id, poem_text, voice_reflection,
       category, status, guardian_consent_verified, submitted_at)
    VALUES
      (NULL, v_student_id, btrim(v_row ->> 'poem_text'),
       NULLIF(btrim(COALESCE(v_row ->> 'voice_reflection', '')), ''),
       v_category,
       CASE WHEN p_submit THEN 'submitted' ELSE 'draft' END,
       v_confirmed,
       now());

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object('imported', v_count, 'school_id', v_school_id);
END;
$$;

REVOKE ALL ON FUNCTION public.school_bulk_import(jsonb, boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.school_bulk_import(jsonb, boolean) FROM anon;
GRANT EXECUTE ON FUNCTION public.school_bulk_import(jsonb, boolean) TO authenticated;

-- -------------------------------------------------------------
-- 9. Results for the signed-in school (status + average + feedback)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.school_entry_results()
RETURNS TABLE (
  entry_id       uuid,
  student_id     uuid,
  student_name   text,
  category       text,
  status         text,
  submitted_at   timestamptz,
  updated_at     timestamptz,
  average_score  numeric,
  score_count    bigint,
  feedback       text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    e.id,
    ss.id,
    ss.full_name,
    e.category,
    e.status,
    e.submitted_at,
    e.updated_at,
    CASE WHEN s.results_visible THEN round(avg(sc.score)::numeric, 1) END,
    CASE WHEN s.results_visible THEN count(sc.score) ELSE 0 END,
    CASE WHEN s.results_visible THEN
      COALESCE(
        array_agg(NULLIF(sc.notes, '') ORDER BY sc.score DESC)
          FILTER (WHERE sc.notes <> ''),
        ARRAY[]::text[]
      )
    ELSE
      ARRAY[]::text[]
    END
  FROM public.entries e
  JOIN public.school_students ss ON ss.id = e.school_student_id
  JOIN public.schools s ON s.id = ss.school_id
  JOIN public.school_members sm ON sm.school_id = ss.school_id
  LEFT JOIN public.scores sc ON sc.entry_id = e.id
  WHERE sm.user_id = auth.uid()
  GROUP BY e.id, ss.id, ss.full_name, e.category, e.status,
           e.submitted_at, e.updated_at, s.results_visible
  ORDER BY ss.full_name;
$$;

REVOKE ALL ON FUNCTION public.school_entry_results() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.school_entry_results() FROM anon;
GRANT EXECUTE ON FUNCTION public.school_entry_results() TO authenticated;
