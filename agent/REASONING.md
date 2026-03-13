# REASONING.md - Architectural Decisions

Documenting the "Why" behind the project's technical choices.

## 1. Why Next.js App Router?
- **Decision:** Use Next.js 14+ App Router with RSC.
- **Rationale:** Public consultancy pages require SEO. RSC sends zero JS for static content, improving PageSpeed scores and SEO rank.
- **Trade-off:** Slightly steeper learning curve for `createClient` vs the old `pages/api` pattern.

## 2. Why Supabase?
- **Decision:** Backend-as-a-Service (Postgres + Auth + Storage).
- **Rationale:** For an education consultancy, a relational DB is necessary for leads and courses. Supabase provides Auth out-of-the-box, saving weeks of development.
- **Trade-off:** Dependency on a third-party managed platform, but ideal for rapid scaling.

## 3. Why shadcn/ui?
- **Decision:** Radix UI based accessible components.
- **Rationale:** Provides high-quality, professional-grade components that are "copied" into the codebase, allowing for full customization without vendor lock-in.

## 4. Why Server Actions?
- **Decision:** Secure form submission without dedicated API routes.
- **Rationale:** Simplifies code, allows for typesafe mutations, and fits the Next.js mental model perfectly.
- **Security:** CSRF protection and secret verification happen on the server.
