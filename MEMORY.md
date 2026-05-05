# MEMORY.md

High-signal project notes for future sessions.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova).
- Supabase for Auth, Postgres, Storage.

## Commands

- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

## App structure

- Public site routes live in `app/(website)`.
- Admin dashboard routes live in `app/(dashboard)/dashboard`.
- Login page is `app/login/page.tsx`.

## Auth + Supabase

- Dashboard auth is enforced in `app/(dashboard)/dashboard/layout.tsx` using `lib/actions/auth.action.ts`.
- No `middleware.ts` exists; do not assume middleware-based auth.
- Supabase clients return `null` when env vars are missing; many server actions handle this by returning `null` or errors.
- Supabase server client: `lib/supabase/server.ts`; browser client: `lib/supabase/client.ts`.

## Env vars

- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).
- Prisma URLs exist in `.env.example` but Prisma schema is not present in repo.

## Database + Storage

- Schema and RLS policies are documented in `supabase.md`.
- Storage bucket: `images` (public); upload logic in `lib/actions/storage.action.ts`.

## Data flow conventions

- Server Actions in `lib/actions` validate with Zod schemas in `lib/validations`.
- Public lead form inserts via server action and revalidates `/dashboard/leads`.

## UI conventions

- shadcn/ui config in `components.json`; Tailwind variables in `app/globals.css`.

## Repo guidance

- Follow `GEMINI.md`, `AGENTS.md` and `agent/*.md` (WORKFLOWS/SAFETY/REASONING/MEMORY) for project mandates.
