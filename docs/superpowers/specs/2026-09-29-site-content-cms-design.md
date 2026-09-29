# Admin "Edit Site Yourself" (Site Content CMS) — Design Spec
Date: 2026-09-29
Status: Approved (Sections 1–3 confirmed by user)

## 1. Goal
Let the admin edit prize-site content themselves — words, dates, prizes,
images, links, section visibility — from the admin dashboard, with no code
changes and no deploy. Phase 1 covers content settings; a block builder
(section reorder, per-section design) is a possible later phase reusing the
same key structure.

## 2. Scope (Section 1 — approved)
- Editable groups (all under `/prize`):
  - Hero: title, subtitle, CTA label/link, hero image URL.
  - Theme: name, description.
  - Key dates: entry deadline, shortlist date, final dates, countdown target.
  - Prizes: 1st/2nd/3rd amounts, 4th–20th amount, Top-100 text.
  - Spark Pack: intro paragraphs, closing line.
  - Community: WhatsApp link + member count, contact email/phone.
  - Visibility toggles: prizes section, countdown, WhatsApp band.
- Explicitly out of scope for Phase 1: drag-to-reorder sections, custom
  layouts/colors per section, non-prize (company) pages.

## 3. Data + Backend (Section 2 — approved)
- Migration `00004_site_settings.sql`:
  - `site_settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz DEFAULT now())`,
    seeded with today's live copy.
  - RLS: public read for `anon` + `authenticated`; write only when
    `profiles.role = 'admin'`.
  - Bonus hardening (same migration, flagged): trigger blocking
    non-service-role changes to `profiles.role`, closing the
    self-promotion hole (any entrant could otherwise set role='admin').
- Frontend `useSiteSettings()` hook: fetch once, in-memory cache,
  stale-while-revalidate ~60s. Access via `setting('prize.first', DEFAULT)`
  where the default is today's hardcoded copy — a missing key never blanks
  the page.
- Admin "Site Content" tab: keys grouped by prefix, typed inputs
  (text/number/date/URL/toggle), per-group save, optimistic UI + toast,
  "view page" links, per-key reset-to-default.

## 4. Page Wiring Order
Home → Spark Pack → Key Dates → EnterNow → HowToEnter/About/Parents.
One page at a time, each independently revertible via key reset.

## 5. Edge Cases + Testing (Section 3 — approved)
- Missing/corrupt key → hardcoded fallback renders + "using default" badge
  in admin. Bad edits can't white-screen the site.
- Concurrent admins → last-write-wins per key; `updated_at` per group.
- Migration is additive/read-only: zero downtime; admin tab ships after.
- Tests: RLS (anon read OK, entrant write blocked, admin write OK),
  fallback rendering, lint + `vite build`, manual edit→reflect pass.

## Spec Self-Review
- Placeholders: none.
- Consistency: fallbacks reference today's live copy; key prefixes match
  admin groups and wiring order.
- Scope: single phase; block builder explicitly deferred, keys designed to
  map forward to it.
- Ambiguity resolved: Phase 1 = content values + visibility only.
