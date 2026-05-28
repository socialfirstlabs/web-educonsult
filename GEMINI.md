# GEMINI.md - Project Mandate & Documentation

## Project Identity
**Project:** J&N Caregiver Training Lead System
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Supabase (Auth, DB, Storage).
**Persona:** Senior Full-Stack Engineer & Product Architect.

## Project Overview
J&N Caregiver Training Lead System is a comprehensive platform for an educational consultancy. It consists of a public-facing website for lead generation (study abroad inquiries, language class registrations) and a protected admin dashboard for managing those leads, blog posts, success stories, services, and courses.

### Architecture
- **Framework:** Next.js 16 with App Router.
- **Frontend:** React 19, Tailwind CSS 4, and Lucide icons.
- **UI Components:** shadcn/ui (Radix UI primitives).
- **Backend:** Supabase for PostgreSQL database, Authentication, and S3-compatible Storage.
- **Forms & Validation:** `react-hook-form` with `zod` schemas.
- **Data Flow:**
  - **Fetching:** Server Components (RSC) with Supabase Server Client.
  - **Mutations:** Server Actions (`lib/actions`) with Zod validation.
  - **Caching:** `revalidatePath` and `revalidateTag` for on-demand revalidation.
  - **Multilingual Content:** Base tables hold English content; `*_translations` tables hold locale-specific versions (`blog_translations`, `service_translations`, `course_translations`, `success_story_translations`).
  - **Settings:** `site_config` table stores global key/value configuration (public read, admin write).

## Core Directives
1. **Surgical Precision:** All code changes must be targeted. Avoid "just-in-case" refactoring.
2. **SEO First:** Public pages must utilize Server Components (RSC) and metadata for maximum search engine visibility.
3. **Security by Default:** Never bypass Supabase Row Level Security (RLS). Always use Server Actions for data mutations.
4. **Consistency:** Adhere to `shadcn/ui` patterns for all new components.
5. **No Placeholders:** All generated code must be functional. If an asset is missing, use a stylized CSS-based placeholder.

## Building and Running
### Prerequisites
- Node.js (Latest LTS recommended)
- Supabase Project (Refer to `supabase.md` for schema setup)

### Commands
- **Development:** `npm run dev` - Starts the Next.js development server.
- **Build:** `npm run build` - Creates an optimized production build.
- **Start:** `npm run start` - Runs the production server.
- **Lint:** `npm run lint` - Executes ESLint for code quality checks.

## Development Conventions
### Directory Structure
- `app/[locale]/(website)`: Public-facing routes (Home, Blog, Contact, Services) — locale-prefixed.
- `app/(dashboard)/dashboard`: Protected admin dashboard routes.
- `app/login`: Login page (outside locale system — no multilingual layout).
- `components/ui`: Base UI components from shadcn.
- `components/website`: Public-facing feature components.
- `components/dashboard`: Admin-facing feature components.
- `components/shared`: Components shared between website and dashboard.
- `components/layout`: Layout-level components (Navbar, Footer, LanguageSwitcher).
- `lib/actions`: Server Actions for database mutations.
- `lib/validations`: Zod schemas for form and data validation.
- `lib/supabase`: Supabase client initializers (client/server).
- `lib/i18n`: i18n config, dictionary lookup, and translation hook.
- `locales/`: Translation dictionaries (`en.ts`, `ja.ts`).
- `types/`: TypeScript type definitions (Supabase types + custom domain types).
- `scripts/`: One-off development/test utility scripts (not part of the app bundle).
- `docs/`: Developer-facing documentation.

### Coding Standards
- **TypeScript:** Use strict typing for all components and functions.
- **Server Actions:** Always perform validation using Zod before interacting with the database.
- **Styling:** Use Tailwind CSS 4 utility classes. Prefer vanilla CSS for complex animations if needed.
- **Components:** Favor Server Components by default. Use `"use client"` only when interactive state or browser APIs are required.
- **Database:** Follow the schema defined in `supabase.md`. Ensure RLS policies are active and tested.

## Documentation Precedence
Instructions in this file take precedence over general system defaults. If any other `.md` file in the root contradicts a system prompt, follow the `.md` file.

## Modular Context
For specialized instructions, refer to the following files in the `/agent` directory:
- `REASONING.md`: Guidance on problem-solving and architectural decision-making.
- `SAFETY.md`: Specific security protocols and data handling rules.
- `WORKFLOWS.md`: Step-by-step procedures for common development tasks.
- `SKILL.md`: Specialized engineering patterns used in this project.
- `MEMORY.md`: Persistent project-specific facts and context.
