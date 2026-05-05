# WORKFLOWS.md - Operational Life Cycle

The following workflows must be strictly followed for all changes.

## 1. Feature Workflow (Plan -> Act -> Validate)
1. **Research:** Map requirements to existing schema/components using `grep_search`.
2. **Strategy:** Share the architectural plan (e.g., new tables, UI changes).
3. **Execution:** Apply surgical changes. Use `shadcn/ui` for components.
4. **Validation:** Manually verify UI/UX and test data flows (Supabase).

## 2. Database & Schema Workflow
1. **Schema:** Check `supabase.md` before adding new tables or columns.
2. **Types:** Run after schema changes — regenerates `types/supabase.ts`:
   ```bash
   npx supabase gen types typescript --project-id svecpkgbhyteupsmtvvl > types/supabase.ts
   ```
3. **Type usage:** Use `Tables<T>`, `TablesInsert<T>`, `TablesUpdate<T>` from `@/types`.
4. **Actions:** Create/Update Server Actions in `lib/actions/` ensuring Zod validation in `lib/validations/`.

## 3. Tailwind 4 & UI Workflow
1. **Styling:** Use Tailwind 4 utility classes.
2. **Components:** Use `npx shadcn@latest add [component]` to add new UI elements.
3. **Icons:** Use `lucide-react` for all system icons.

## 3. SEO Content Workflow
1. **CMS:** Create a blog post via Dashboard (Admin only).
2. **Image:** Upload to `images` bucket in Supabase Storage.
3. **Validation:** Check `app/(website)/blog/[slug]/page.tsx` for metadata and visual layout.

## 4. Authentication Workflow
- `middleware.ts` at the project root handles both locale routing and auth protection.
- It redirects unauthenticated requests to `/dashboard/*` → `/login`.
- It redirects authenticated users at `/login` → `/dashboard`.
- Protected routes MUST be inside `app/(dashboard)/dashboard/`.
- `lib/supabase/server.ts` provides the authenticated server client for use in layouts and actions.
