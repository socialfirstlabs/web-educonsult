# AGENTS.md

## Quick start

- Use npm (package-lock.json). Common scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

## Env + Supabase

- Required env vars live in `.env.example` (Supabase URL + anon key at minimum). Many server actions return null and dashboard pages show errors if these are missing.
- Supabase schema + storage bucket setup is documented in `supabase.md` (tables, RLS policies, and `images` bucket).
- Optional: Supabase typegen command is in `supabase.md` (outputs to `types/supabase.ts`).

## App structure + auth

- App Router with route groups: public pages in `app/[locale]/(website)`, admin in `app/(dashboard)/dashboard`.
- Dashboard auth is enforced in layers: `proxy.ts` (edge, outermost — Next.js 16 convention) → `app/(dashboard)/dashboard/layout.tsx` via `lib/actions/auth.action.ts` → explicit `getUser()` guards in all mutation Server Actions → Supabase RLS.
- Server Actions live in `lib/actions` and validate with Zod schemas in `lib/validations`.

## UI + component conventions

- shadcn/ui config is in `components.json` (style `base-nova`, Tailwind CSS variables in `app/globals.css`).

## Repo-specific guidance

- Follow `GEMINI.md`, `AGENTS.md` and `agent/*.md` (WORKFLOWS/SAFETY/REASONING/MEMORY) when making changes.
