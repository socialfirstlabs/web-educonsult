# REASONING.md - Architectural Decisions

Documenting the "Why" behind the project's technical choices.

## 1. Why Next.js 16 App Router?
- **Decision:** Use Next.js 16 App Router with RSC and React 19.
- **Rationale:** Public consultancy pages require high-performance SEO. RSC and the improved React 19 features (like Actions and better Suspense) ensure the fastest possible time-to-interactive for students.

## 2. Why Tailwind CSS 4?
- **Decision:** Use the latest Tailwind CSS 4 engine.
- **Rationale:** Faster build times and simplified configuration using the new CSS-first approach, which aligns with our "Vanilla CSS" preference for complex animations while maintaining utility-first speed.

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
