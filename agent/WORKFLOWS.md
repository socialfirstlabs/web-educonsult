# WORKFLOWS.md - Operational Life Cycle

The following workflows must be strictly followed for all changes.

## 1. Feature Workflow (Plan -> Act -> Validate)
1. **Research:** Map requirements to existing schema/components using `rg`.
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
3. **Validation:** Check `app/[locale]/(website)/blog/[slug]/page.tsx` for metadata and visual layout.

## 4. Authentication Workflow
- No `middleware.ts` exists in the repo. Locale routing uses `app/page.tsx` to redirect to the default locale and `app/[locale]/layout.tsx` to validate locale params.
- Dashboard auth is enforced in `app/(dashboard)/dashboard/layout.tsx` via `getUserAction()`; unauthenticated users are redirected to `/login`.
- The login page is client-side and navigates to `/dashboard` after successful sign-in.
- Protected routes MUST be inside `app/(dashboard)/dashboard/`.
- `lib/supabase/server.ts` provides the authenticated server client for use in layouts and actions.
