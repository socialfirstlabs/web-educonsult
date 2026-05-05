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

- `middleware.ts` exists at the project root and handles:
  1. Locale routing: `/` → `/en`, and bare paths → `/{defaultLocale}/{path}`
  2. Supabase session refresh on every request
  3. Dashboard route protection (redirect to `/login` if unauthenticated)
  4. Login page redirect if already authenticated → `/dashboard`
- Supabase clients return `null` when env vars are missing; many server actions handle this by returning `null` or errors.
- Supabase server client: `lib/supabase/server.ts`; browser client: `lib/supabase/client.ts`.

## Env vars

- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).
- Prisma URLs exist in `.env.example` but Prisma schema is not present in repo.

## Database + Storage

- Schema and RLS policies are documented in `supabase.md`.
- Storage bucket: `images` (public); upload logic in `lib/actions/storage.action.ts`.
- `types/supabase.ts` contains hand-authored DB types matching the schema. Regenerate via:
  `npx supabase gen types typescript --project-id "YOUR_REF" > types/supabase.ts`

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
