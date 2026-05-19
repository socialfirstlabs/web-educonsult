# MEMORY.md

> **Append-only session log.** After each significant work session, append new facts below.
> Source-of-truth specs live in `GEMINI.md`. This file captures live project state.

High-signal project notes for future sessions.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova).
- Supabase for Auth, Postgres, Storage.

## Commands

- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

## App structure

- Public site routes live in `app/[locale]/(website)` (locale-prefixed).
- Admin dashboard routes live in `app/(dashboard)/dashboard`.
- Login page is `app/login/page.tsx` — intentionally outside the locale system.

## Auth + Supabase

- `proxy.ts` exists at the **project root** and handles (Next.js 16 convention — replaces deprecated `middleware.ts`):
  1. Locale routing: `/` → `/en`, bare paths → `/{defaultLocale}/{path}`
  2. Supabase session **cookie refresh** on every request (required by `@supabase/ssr`)
  3. Dashboard route protection — redirects to `/login` if `getUser()` returns null
  4. Login page redirect → `/dashboard` if already authenticated
- Auth enforcement layers (defense-in-depth, outermost to innermost):
  1. **Edge Proxy** (`proxy.ts`) — blocks unauthenticated requests before any page/action
  2. **Layout Guard** (`app/(dashboard)/dashboard/layout.tsx`) — `getUserAction()` redirects if not admin
  3. **Action Guards** (all mutation Server Actions) — explicit `getUser()` + role check before any DB write
  4. **RLS** (Supabase DB) — final layer; write policies enforce `app_metadata.role = 'admin'`
- `getUserAction()` in `lib/actions/auth.action.ts` verifies the user is authenticated via server-side JWT validation (`getUser()`, not `getSession()`). It does NOT currently check `app_metadata.role` — that check causes a redirect loop until the SQL migration is run AND the admin role is manually assigned to the user. See the comment in `auth.action.ts` for the exact steps to enable it safely.
- **Admin role** enforcement lives at the **database layer** (RLS via `public.is_admin()`) once the SQL migration is applied. Application-layer role check can be added after that.
- Supabase clients return `null` when env vars are missing; actions handle this gracefully.
- Supabase server client: `lib/supabase/server.ts`; browser client: `lib/supabase/client.ts`.

## Env vars

- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).

## Database + Storage

- Schema and RLS policies are documented in `supabase.md`.
- Storage bucket: `images` (public); upload logic in `lib/actions/storage.action.ts`.
- **Translation table pattern:** Every content type has a base table (EN) and a `*_translations` table per locale.
  - `blog_posts` + `blog_translations`
  - `services` + `service_translations`
  - `courses` + `course_translations`
  - `success_stories` + `success_story_translations`
- `site_config` is a `key/value` settings store (public SELECT, admin manage).
- `types/supabase.ts` is **auto-generated** by the Supabase CLI. Regenerate after schema changes:
  ```bash
  npx supabase gen types typescript --project-id svecpkgbhyteupsmtvvl > types/supabase.ts
  ```
- Use `Tables<T>`, `TablesInsert<T>`, `TablesUpdate<T>` from `@/types` (not `InsertDto`/`UpdateDto`).

## Data flow conventions

- Server Actions in `lib/actions` validate with Zod schemas in `lib/validations`.
- Public lead form inserts via server action and revalidates `/dashboard/leads`.

## UI conventions

- shadcn/ui config in `components.json`; Tailwind variables in `app/globals.css`.

## i18n conventions

- Supported locales: `en`, `ja`, `ne` (see `lib/i18n/config.ts`).
- Translation dictionaries in `locales/en.ts`, `locales/ja.ts`, `locales/ne.ts`.
- `getT(locale)` from `lib/i18n/index.ts` is the server-side translation function.
- `useTranslation(locale)` from `lib/i18n/useTranslation.ts` is the client-side hook.
- `isValidLocale(string)` from `lib/i18n/config.ts` validates `[locale]` route params.

## Repo guidance

- Follow `GEMINI.md`, `AGENTS.md` and `agent/*.md` (WORKFLOWS/SAFETY/REASONING/SKILL/MEMORY) for project mandates.

## Security (2026-05-19 — P0 + P1 fixes applied)

- `proxy.ts` **created** at project root — this was the P0 missing file (Next.js 16 uses `proxy.ts` with `export proxy`, not `middleware.ts`).
- `getUserAction()` now enforces `app_metadata.role === 'admin'` (code-level admin check).
- SQL migration `supabase/migrations/20260519000000_fix_p0_admin_rls.sql` — run in Supabase SQL Editor to lock RLS policies to admin role only. Creates `public.is_admin()` SECURITY DEFINER helper.
- **To set admin role for a user** (run in Supabase SQL Editor):
  ```sql
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = 'your-admin@email.com';
  ```
- All 9 mutation Server Actions now have explicit `getUser()` auth guards (P1 fix).
- File uploads now use `file-type` magic bytes MIME detection — client-declared `file.type` is ignored (P1 fix).
- **Still required manually**: Supabase Dashboard → Authentication → Settings → Disable "Enable Email Signup".
- Supported locales: `en`, `ja`. Translation dictionaries live in `locales/en.ts` and `locales/ja.ts`.
