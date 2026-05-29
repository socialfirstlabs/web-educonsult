# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Run production server (after build)
npm run lint     # Run ESLint
```

No test suite is configured. There is no `npm test` command.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ENABLE_BLOG=true   # feature flag — controls Blog nav link and dashboard section
NEXT_PUBLIC_SITE_URL=          # optional; used in lib/constants.ts for og/meta URLs
```

`NEXT_PUBLIC_ENABLE_BLOG` is parsed by `isEnabled()` in `lib/constants.ts` which accepts `"true"`, `"1"`, `"yes"`, `"on"` (case-insensitive).

## Architecture

This is a **Next.js 16 App Router** project (React 19, Tailwind CSS v4, Zod v4) for an education consultancy (Nepal → Japan study abroad). It has two distinct surface areas sharing the same repo:

### 1. Public Website — `app/[locale]/(website)/`

- Route prefix `[locale]` supports `en` and `ja` (defined in `lib/i18n/config.ts`)
- `app/page.tsx` immediately redirects `/` → `/en`
- `app/[locale]/layout.tsx` validates the locale; `app/[locale]/(website)/layout.tsx` renders the shared nav/footer
- Translations live in `locales/en.ts` and `locales/ja.ts` as flat key→string maps; `lib/i18n/index.ts` exposes `getT(locale)` to look up keys
- All nav/footer links are prefixed with `/${locale}/`

### 2. Admin Dashboard — `app/(dashboard)/dashboard/`

- Access is gated by `lib/actions/auth.action.ts` → `getUserAction()`; unauthenticated users are redirected to `/login`
- Dashboard layout (`app/(dashboard)/dashboard/layout.tsx`) renders a sidebar with links to Leads, Services, Courses, Blog (feature-flagged), and Success Stories
- The Blog section only appears when `NEXT_PUBLIC_ENABLE_BLOG=true` (checked via `FEATURE_FLAGS.ENABLE_BLOG` in `lib/constants.ts`)

### Data Layer — Supabase

- **Server client**: `lib/supabase/server.ts` — use inside Server Components and Server Actions (returns `null` if env vars are missing, so callers must null-check)
- **Browser client**: `lib/supabase/client.ts` — use inside Client Components
- All write actions (`lib/actions/*.action.ts`) are `"use server"` files that explicitly call `supabase.auth.getUser()` before any mutation to enforce auth even if RLS policies change
- **Admin RLS**: write access to all tables is restricted to users whose `app_metadata.role === 'admin'`. This is enforced by the `public.is_admin()` SQL function (see `supabase/migrations/20260519000000_fix_p0_admin_rls.sql`). To grant admin access, set `raw_app_meta_data = {"role": "admin"}` via the Supabase Dashboard or SQL editor — regular users cannot self-assign this
- Generated TypeScript types are in `types/supabase-v1.ts`. Regenerate with `supabase gen types typescript --linked > types/supabase-v1.ts` (requires the `supabase` CLI in devDependencies)
- Apply migrations with `supabase db push`

### Database Tables

Each content type follows a base table + `_translations` table pattern (locale-specific fields stored separately):

| Base table | Translation table | Notes |
|---|---|---|
| `blog_posts` | `blog_translations` | `blog_id` + `locale` unique |
| `services` | `service_translations` | `is_active` flag |
| `courses` | `course_translations` | `order_index` for display order |
| `success_stories` | `success_story_translations` | `is_published` flag |
| `leads` | _(none)_ | Public INSERT allowed; SELECT is admin-only |
| `site_config` | _(none)_ | Key-value store |

Storage bucket `images` is used for uploaded assets (admin-only upload/delete policies).

### Component Patterns

- `components/dashboard/<Entity>Client.tsx` — Client Component wrapping the list + form with local state (open/edit dialogs)
- `components/dashboard/<Entity>List.tsx` — renders the data table with edit/delete buttons
- `components/dashboard/<Entity>Form.tsx` — react-hook-form + zod schema (`lib/validations/<entity>.schema.ts`) wired to server actions
- `components/ui/` — shadcn/ui primitives (Button, Card, Dialog, Form, etc.)

### i18n Pattern

Server Components use `getT(locale)` from `lib/i18n/index.ts`. To add a translation key, add it to both `locales/en.ts` and `locales/ja.ts` — the `TranslationKey` type is derived from `locales/en.ts` so TypeScript will catch missing keys.

### Dashboard UI components

- `components/dashboard/SidebarNav.tsx` — Client Component using `usePathname()` for active sidebar link highlighting. Accepts `enableBlog: boolean` prop. Used by `app/(dashboard)/dashboard/layout.tsx`.
- Dashboard overview (`app/(dashboard)/dashboard/page.tsx`) — fetches counts from all 5 content tables; stat cards and quick-action tiles are `<Link>` components.

### Migrations

Two migration files in `supabase/migrations/`:
1. `20240101000000_initial_schema.sql` — creates all tables, enables RLS, adds public-read and public-insert-leads policies, creates `images` storage bucket
2. `20260519000000_fix_p0_admin_rls.sql` — adds `public.is_admin()` function and admin-only write policies for all tables and storage

To apply to a new Supabase project:
```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```
Or paste both SQL files directly into the Supabase SQL Editor in order.

To grant admin role to a user:
```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"'::jsonb)
WHERE email = 'your-admin@email.com';
```

### i18n / Translations pattern

- **Base tables** (`blog_posts`, `courses`, `services`, `success_stories`) store **English (`en`)** content — the default locale
- **`*_translations` tables** store **Japanese (`ja`) versions only** — linked by FK + `locale = 'ja'`
- Action functions merge translation fields over base fields at render time
- Dashboard forms have two sections: English (base table) and Japanese (`*_translations`)
- There are exactly two locales: `en` and `ja`. The `*_translations` tables hold only `ja` rows.

### Non-obvious behaviors

**Blog slug resolution** (`app/[locale]/(website)/blog/[slug]/page.tsx`): slug lookup runs two passes — first against `blog_posts.slug` (English), then falls back to `blog_translations.slug` for the current locale. Both can resolve to the same post.

**Image upload security** (`lib/actions/storage.action.ts`): MIME type is validated via magic-byte inspection (`file-type` library) server-side, ignoring the client-supplied `file.type`. Extension is also derived from the detected MIME, not the original filename.

**Blog content sanitization** (`app/[locale]/(website)/blog/[slug]/page.tsx`): `sanitize-html` strips untrusted HTML before render. The iframe allowlist permits only `www.youtube-nocookie.com` and `player.vimeo.com`. All `src` attributes must use `https`.

**Nullable DB fields**: Several fields in `supabase-v1.ts` are `T | null` (e.g. `created_at`, `is_published`, `excerpt`). Dashboard component interfaces use `Omit<ZodValues, 'field'> & { field: T | null }` to override non-nullable Zod types. Edit forms receive null-to-default adapters (`?? ''`, `?? false`) at the call site in `*List.tsx` files.

**Branding**: The nav/UI uses "J & N Caregiver Training" — not "EduNepal" (a legacy placeholder). Logo files are at `public/images/JN_Logo*.png`.
