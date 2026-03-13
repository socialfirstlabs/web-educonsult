# SKILL.md - Project Specialized Skills

This project leverages specific engineering patterns. Use these skills when extending the app.

## 1. Supabase SSR Integration
- **Context:** Managing authentication and database calls in the Next.js App Router (Server Components & Actions).
- **Practice:** Use `@supabase/ssr` with cookie-based session management as implemented in `lib/supabase/server.ts`.

## 2. Lead Generation Patterns
- **Context:** Securely capturing and processing student inquiries.
- **Practice:** Utilize `react-hook-form` + `zod` on the client, and `Server Actions` for the database insert to avoid exposing public POST endpoints.

## 3. SEO Optimization for Education
- **Context:** Dominating search results for "Study in Japan from Nepal".
- **Practice:** Heavy use of RSC, dynamic metadata via `generateMetadata`, and `next/image` with proper alt text for success stories.

## 4. Admin Dashboard Crafting
- **Context:** Building highly functional CMS tools using `shadcn/ui`.
- **Practice:** Implementation of accessible data tables, complex forms, and secure authentication flows.
