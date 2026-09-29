# Dashboard-First Entry + Guardian Email Code — Design Spec
Date: 2026-09-29
Status: Approved (Sections 1–3 confirmed by user)

## 1. Goal
Let users sign up to a dashboard first without being forced to submit a poem.
When ready, they start an entry wizard. Final poem submission is blocked until
guardian consent is verified via a unique per-entrant code sent to the
guardian's email.

## 2. User Flow (Section 1 — approved)
- Signup (`/prize/auth`) → `/prize/dashboard` shows Welcome state, not a forced form:
  greeting ("Hi {name}"), what-happens-next, countdown, resources
  (Spark Pack, How to Enter, Key Dates), primary CTA "Start your entry when ready".
- Click Start → Entry wizard (stepped, same page):
  1. Guardian: guardian name + guardian email → Send code.
  2. Verify: enter 6-digit code → unlocks poem step.
  3. Poem: category, poem title/text, Voice Reflection → Save Draft anytime,
     exit/resume freely.
  4. Review → Final Submit. Button disabled until consent_verified = true.
     After submit, entry locks; status view unchanged (submitted/shortlisted/finalist).
- Existing drafts without verified consent must verify before submit.

## 3. Data + Backend (Section 2 — approved)
- New table `guardian_consents`:
  `entrant_id uuid PK REFERENCES profiles(id) ON DELETE CASCADE`,
  `guardian_name text NOT NULL`,
  `guardian_email text NOT NULL`,
  `code_hash text NOT NULL` (SHA-256, never plain text),
  `expires_at timestamptz NOT NULL`,
  `attempts int NOT NULL DEFAULT 0`,
  `verified_at timestamptz`,
  `created_at timestamptz DEFAULT now()`.
  RLS: entrant read/insert/update own row only; admin read all; service_role full.
- Edge Functions (mirroring `supabase/functions/send-judge-email` with Resend):
  - `send-guardian-code` (auth'd entrant only, 1/min rate limit): generate 6-digit
    code, store hash + 30-min expiry, send guardian email (code + child name +
    consent explanation), write `email_logs` row (`guardian_consent_code`).
    Reuses `RESEND_API_KEY` + `FROM_EMAIL`.
  - `verify-guardian-code`: check hash, expiry, attempts <= 5; on success set
    `verified_at`, upsert `guardians` row with `consent_given = true`.
- `entries`: add `guardian_consent_verified boolean DEFAULT false`
  (set true on verified submit) or derive from `guardian_consents.verified_at`.
  Final submit requires verified = true, enforced in UI plus DB check/RLS so
  UI bypass cannot submit.

## 4. Code Rules (confirmed)
- 6-digit numeric code, 30-minute expiry, 5 attempts max.
- Resend allowed after 60-second cooldown; new code invalidates old.
- Max 5 sends/hour per entrant.

## 5. Edge Cases + Error Handling (Section 3 — approved)
- Guardian email changed mid-wizard → new code invalidates old, must re-verify.
- Expired code / too many attempts → clear error + "Resend new code".
- Resend spam → 60s cooldown + hourly cap, surfaced in UI.
- Draft saved before verification → stays `draft`; Final Submit blocked with
  "Verify guardian code to submit".
- Guardian never replies → draft retained, not judged; dashboard shows
  "Awaiting guardian verification" nudge.
- Email delivery failure → error toast + log in `email_logs` with `failed` status.

## 6. Frontend Changes
- `EntrantDashboard.jsx`: replace forced `mode === 'consent'` first-login with
  `mode === 'welcome'`; add `startEntry()` → wizard steps
  (`guardian` → `verify` → `poem` → `review`); keep existing
  `Save Draft` / `Submit Entry` / confirm modal, gating final submit on verified flag.
- `EnterNow.jsx` copy update: "Create account to get your dashboard, then submit when ready."
- No changes to judge/admin dashboards except reading new verified flag.

## 7. Testing
- Unit: code hash/expiry/attempt logic.
- RLS tests for `guardian_consents`.
- Manual end-to-end: signup → welcome → send → verify → draft → submit;
  expiry, resend, wrong-code, email-change paths.
- Resend sandbox for guardian email template.

## 8. Out of Scope
- Guardian portal/login; guardian acts via email code only.
- SMS delivery; email only.
- Changing prize rules, judging, or Spark Pack content.

## Spec Self-Review
- Placeholders: none.
- Consistency: welcome-first flow matches wizard gating; DB flag matches UI gate.
- Scope: single feature (dashboard-first + guardian code), no unrelated refactor.
- Ambiguity resolved: 6-digit/30-min/5-attempts/60s-cooldown chosen explicitly.
