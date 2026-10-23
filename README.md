# Firestarter

The website and competition platform for **The Firestarter Method** by Shola
Amaraibi. One React app serves two connected sites:

| | Company site | Prize platform |
|---|---|---|
| Purpose | Present the Firestarter Method | Run the Firestarter Young Poets Prize 2026 |
| Entry point | `/` | `/prize` |
| Pieces | Method, Work With Me, Briefing, The Musical, Contact | About, How to Enter, Key Dates, Spark Pack, entry flow, dashboards |

## Stack

- React 19 + Vite 8, React Router 7
- Supabase (Postgres, Auth, Row-Level Security, Edge Functions)
- Resend for transactional email
- Framer Motion, Chart.js, CSS Modules
- Deployed on Vercel (SPA rewrite + static prerender)

## Local development

Requires Node 20.19+ (Vite 8).

```bash
npm install
cp .env.example .env   # fill in the two Supabase values
npm run dev
```

The app will not boot without `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` — `src/lib/supabase.js` throws a clear error if they
are missing. Do not commit `.env`.

Scripts:

```bash
npm run dev      # Vite dev server
npm run build    # vite build + per-route prerender (scripts/prerender.mjs)
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Backend setup

Migrations live in `supabase/migrations` and are applied in filename order:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

`00007_security_and_integrity.sql` is required. It makes judge creation
admin-only, restricts profile reads, allows the `withdrawn` entry status, and
enforces the guardian-consent and entry-lock rules in the database.

`00008_consent_form.sql` adds the Participant Commitment & Parental Consent
fields (safeguarding, supervision, poem publication, photography consent /
opt-out, `consented_at`) to `guardian_consents`. Apply both migrations.

Edge Functions:

```bash
supabase functions deploy send-guardian-code
supabase functions deploy verify-guardian-code
supabase functions deploy send-judge-email
```

Function secrets:

| Secret | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends guardian codes and judge credentials |
| `FROM_EMAIL` | Verified sender, e.g. `noreply@firestartermethod.com` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected
by Supabase automatically.

## Roles and entry flow

Accounts get one of three roles in `profiles.role`: `entrant`, `judge`, `admin`.
Admins create judges from Admin → Judges; the role can only be changed by an
admin (enforced by a database trigger).

Entrant flow (`/prize/auth` → `/prize/dashboard`):

1. Sign up and land on a dashboard, with no forced form.
2. Start an entry when ready: guardian name/email → the Participant
   Commitment & Parental Consent choices (safeguarding, supervision, optional
   poem publication, photography consent or opt-out) → 6-digit code emailed to
   the guardian (30 min, 5 attempts, 60 s resend cooldown) → poem, category,
   optional YouTube link and Voice Reflection.
3. Save drafts freely. Submission is blocked until the guardian code is
   verified — enforced by the UI **and** a database trigger.
4. After submission the entry locks. Admins move it through
   shortlisted → finalist → withdrawn.

Admins get entries, bulk assign/status, CSV export (including photography
consent / opt-out and publication), phases, judge management and email logs.
Judges see only assigned entries and score 1–100 against the rubric.

The full consent form is readable and printable at `/prize/consent-form`; the
dashboard captures the same choices digitally and the guardian confirms them
with the emailed code. Media opt-outs are visible to admins and included in the
CSV export.

## Site content

Short marketing copy (hero, theme, dates, prizes, contact details, briefing
video/booking URL, section visibility) is editable at **Admin → Site Content**.
Keys and defaults live in `src/lib/siteSettings.js`; values are stored in the
`site_settings` table. Missing or cleared values fall back to the defaults, so a
page can never render blank.

## Routing and SEO

Route titles/descriptions live in `src/lib/routesMeta.js` and are consumed by
both `src/App.jsx` (client navigation) and `scripts/prerender.mjs` (static
per-route HTML, Open Graph tags, canonical URLs and JSON-LD). Add a route in one
place to keep both in sync. Dashboard routes are prerendered as `noindex`.

`vercel.json` redirects `/training` to `/briefing` and rewrites unknown paths to
the SPA shell. `public/sitemap.xml` lists the public pages.

## Project layout

```
src/
  components/     shared UI (Nav, Footer, Dashboards, SparkMark, …)
  hooks/          useAuth wrapper, site settings, competition phase
  lib/            Supabase client, auth, placeholders/copy, route metadata
  pages/          one folder per page, CSS Modules alongside
supabase/
  migrations/     schema, RLS and integrity rules
  functions/      Deno Edge Functions
scripts/
  prerender.mjs   per-route static HTML after vite build
docs/             design specs
```

## Deployment

Vercel builds with `npm run build` (Vite + prerender). Set the two
`VITE_SUPABASE_*` variables in the Vercel project. Edge Functions are deployed
separately with the Supabase CLI.
