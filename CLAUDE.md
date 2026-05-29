# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (Turbopack)
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
- `app/page.tsx` immediately redirects `/` → `/en` (also handled by `proxy.ts`)
- `app/[locale]/layout.tsx` validates the locale; `app/[locale]/(website)/layout.tsx` renders the shared nav/footer
- Translations live in `locales/en.ts` and `locales/ja.ts` as flat key→string maps; `lib/i18n/index.ts` exposes `getT(locale)` to look up keys
- All nav/footer links are prefixed with `/${locale}/`

### 2. Admin Dashboard — `app/(dashboard)/dashboard/`

- Primary access gate: `proxy.ts` (edge) redirects unauthenticated requests to `/login` before any page code runs
- Secondary gate: `app/(dashboard)/dashboard/layout.tsx` calls `getUserAction()` as a defense-in-depth check
- Dashboard sidebar links: **Contacts**, **Enrollments**, **Services**, **Courses**, **Blog** (feature-flagged), **Success Stories**
- The Blog section only appears when `NEXT_PUBLIC_ENABLE_BLOG=true` (checked via `FEATURE_FLAGS.ENABLE_BLOG` in `lib/constants.ts`)

### Proxy / Middleware — `proxy.ts` (project root)

Next.js 16 renamed `middleware.ts` → `proxy.ts` and the exported function `middleware` → `proxy`.

`proxy.ts` handles four concerns in one file:
1. **Session refresh** — calls `supabase.auth.getUser()` on every request so the Supabase access-token cookie is refreshed silently (`@supabase/ssr` requirement)
2. **Dashboard auth protection** — unauthenticated `/dashboard/*` → redirect `/login`
3. **Login redirect** — authenticated users visiting `/login` → redirect `/dashboard`
4. **Locale routing** — bare `/` and non-locale-prefixed paths → redirect `/{defaultLocale}/...`

### Data Layer — Supabase

- **Server client**: `lib/supabase/server.ts` — use inside Server Components and Server Actions (returns `null` if env vars are missing, so callers must null-check)
- **Browser client**: `lib/supabase/client.ts` — use inside Client Components
- All write actions (`lib/actions/*.action.ts`) are `"use server"` files that explicitly call `supabase.auth.getUser()` before any mutation
- **Admin RLS**: write access to all content tables is restricted to users whose `app_metadata.role === 'admin'`, enforced by the `public.is_admin()` SQL function
- **Storage RLS**: upload/update/delete on the `images` bucket requires an authenticated session (not `is_admin()`) — the application-layer auth check in `uploadImage()` is sufficient
- Generated TypeScript types are in `types/supabase-v1.ts`. Regenerate with `supabase gen types typescript --linked > types/supabase-v1.ts`
- Apply migrations with `npx supabase db push`

### Database Tables

Each content type follows a base table + `_translations` table pattern (locale-specific fields stored separately):

| Base table | Translation table | Notes |
|---|---|---|
| `blog_posts` | `blog_translations` | `blog_id` + `locale` unique |
| `services` | `service_translations` | `is_active` flag |
| `courses` | `course_translations` | `order_index` for display order |
| `success_stories` | `success_story_translations` | `is_published` flag |
| `contacts` | _(none)_ | Renamed from `leads`. Public INSERT; SELECT is admin-only |
| `enrollments` | _(none)_ | Application form submissions; public INSERT, admin SELECT/UPDATE/DELETE |
| `site_config` | _(none)_ | Key-value store |

Storage bucket `images` is used for uploaded assets (authenticated-user upload/delete policies; 5 MB file size limit; SVG excluded).

### Component Patterns

- `components/dashboard/<Entity>Client.tsx` — Client Component wrapping the list + form with local state (open/edit dialogs)
- `components/dashboard/<Entity>List.tsx` — renders the data table with edit/delete buttons
- `components/dashboard/<Entity>Form.tsx` — react-hook-form + zod schema (`lib/validations/<entity>.schema.ts`) wired to server actions
- `components/ui/` — shadcn/ui primitives (Button, Card, Dialog, Form, etc.)

### i18n Pattern

Server Components use `getT(locale)` from `lib/i18n/index.ts`. To add a translation key, add it to both `locales/en.ts` and `locales/ja.ts` — the `TranslationKey` type is derived from `locales/en.ts` so TypeScript will catch missing keys.

### Dashboard UI components

- `components/dashboard/SidebarNav.tsx` — Client Component using `usePathname()` for active sidebar link highlighting. Accepts `enableBlog: boolean` prop.
- Dashboard overview (`app/(dashboard)/dashboard/page.tsx`) — fetches counts from all content tables; stat cards and quick-action tiles are `<Link>` components.

### Migrations

Six migration files in `supabase/migrations/`, applied in filename order:

| File | Purpose |
|---|---|
| `20240101000000_initial_schema.sql` | All tables, RLS enabled, public-read policies, `contacts`/`leads` public INSERT, `images` storage bucket (no SVG) |
| `20260519000000_fix_p0_admin_rls.sql` | `public.is_admin()` function + admin write policies for all content tables + authenticated-user storage policies |
| `20260529000000_add_enrollments_table.sql` | `enrollments` table with public INSERT and admin-only read/write RLS |
| `20260529000001_rename_leads_to_contacts.sql` | Renames `leads` → `contacts`; drops `interested_country` and `course_interest` columns |
| `20260529000002_remove_svg_from_storage.sql` | Removes `image/svg+xml` from `images` bucket `allowed_mime_types` |
| `20260529000003_fix_storage_rls.sql` | Replaces `is_admin()`-gated storage policies with simpler `authenticated`-only policies |

To apply to a new Supabase project:
```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```
Or paste each SQL file into the Supabase SQL Editor in chronological order.

To grant admin role to a user (required after running migrations — do this once, then sign out and back in):
```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"'::jsonb)
WHERE email = 'your-admin@email.com';
```

### Security architecture

| Layer | Mechanism |
|---|---|
| Edge (all routes) | `proxy.ts` refreshes Supabase session; blocks unauthenticated `/dashboard/*` |
| App layout | `dashboard/layout.tsx` calls `getUserAction()` as defense-in-depth |
| Server Actions | Every write action calls `supabase.auth.getUser()` before mutating |
| Database (content) | RLS `is_admin()` — requires `app_metadata.role = "admin"` in JWT |
| Database (storage) | RLS `TO authenticated` — any valid session may upload |
| Public forms | `lib/rate-limit.ts` — 5 req/min/IP sliding window on `submitLead` + `submitEnrollment` |
| File uploads | Magic-byte MIME inspection (`file-type`); 5 MB server limit; SVG excluded |
| HTTP headers | CSP, HSTS (1 yr + preload), X-Frame-Options, Permissions-Policy, Referrer-Policy |
| Login | Generic "Invalid email or password" error — no account enumeration |

### i18n / Translations pattern

- **Base tables** (`blog_posts`, `courses`, `services`, `success_stories`) store **English (`en`)** content — the default locale
- **`*_translations` tables** store **Japanese (`ja`) versions only** — linked by FK + `locale = 'ja'`
- Action functions merge translation fields over base fields at render time
- Dashboard forms have two sections: English (base table) and Japanese (`*_translations`)
- There are exactly two locales: `en` and `ja`. The `*_translations` tables hold only `ja` rows.

### Non-obvious behaviors

**`proxy.ts` vs `middleware.ts`**: Next.js 16 uses `proxy.ts` / `export async function proxy()`. Do NOT create a `middleware.ts` — both files existing simultaneously causes a build error.

**`revalidatePath` in Server Actions**: Only call it in admin mutations (dashboard). Never call it in public INSERT actions (`submitLead`, `submitEnrollment`) — doing so causes Next.js to send the full RSC payload as the Server Action response, bloating the network response by ~50–200 KB.

**Blog slug validation regex**: `lib/validations/blog.schema.ts` uses `/^[a-z0-9-]+$/`. The `generateSlug()` helper in `BlogForm.tsx` strips everything outside `[a-z0-9\s-]` before converting spaces to hyphens.

**Blog slug resolution** (`app/[locale]/(website)/blog/[slug]/page.tsx`): slug lookup runs two passes — first against `blog_posts.slug` (English), then falls back to `blog_translations.slug` for the current locale.

**Image upload security** (`lib/actions/storage.action.ts`): MIME type is validated via magic-byte inspection (`file-type` library) server-side, ignoring the client-supplied `file.type`. Extension is derived from the detected MIME, not the original filename. SVG is blocked both at the bucket level and in the allowed MIME set.

**Server Action body size** (`next.config.ts`): `experimental.serverActions.bodySizeLimit = "5mb"` — needed for blog featured image uploads. The `uploadImage()` action also enforces this limit server-side.

**Blog content sanitization** (`app/[locale]/(website)/blog/[slug]/page.tsx`): `sanitize-html` strips untrusted HTML before render. The iframe allowlist permits only `www.youtube-nocookie.com` and `player.vimeo.com`. All `src` attributes must use `https`.

**Nullable DB fields**: Several fields in `supabase-v1.ts` are `T | null` (e.g. `created_at`, `is_published`, `excerpt`). Dashboard component interfaces use `Omit<ZodValues, 'field'> & { field: T | null }` to override non-nullable Zod types. Edit forms receive null-to-default adapters (`?? ''`, `?? false`) at the call site in `*List.tsx` files.

**Rate limiting**: `lib/rate-limit.ts` uses a module-level `Map` (sliding window, 5 req/min/IP). This resets on cold starts in serverless environments. For production-scale distributed rate limiting, replace with Upstash Ratelimit (`@upstash/ratelimit` + `@upstash/redis`).

**Branding**: The nav/UI uses "J & N Caregiver Training" — not "EduNepal" (a legacy placeholder). Default blog author fallback is "J & N Team". Logo files are at `public/images/JN_Logo*.png`.
