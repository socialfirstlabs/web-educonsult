# WORKFLOWS.md - Operational Life Cycle

The following workflows must be strictly followed for all changes.

## 1. Feature Workflow (Plan -> Act -> Validate)
1. **Research:** Map requirements to existing schema/components using `grep_search`.
2. **Strategy:** Share the architectural plan (e.g., new tables, UI changes).
3. **Execution:** Apply surgical changes. Use `shadcn/ui` for components.
4. **Validation:** Manually verify UI/UX and test data flows (Supabase).

## 2. Lead Capture Workflow
1. **UI:** Update `LeadForm.tsx` with new fields (with Zod validation).
2. **Action:** Update `lib/actions/lead.action.ts` for database sync.
3. **Admin:** Ensure new fields appear correctly in `app/(dashboard)/dashboard/leads/page.tsx`.

## 3. SEO Content Workflow
1. **CMS:** Create a blog post via Dashboard (Admin only).
2. **Image:** Upload to `images` bucket in Supabase Storage.
3. **Validation:** Check `app/(website)/blog/[slug]/page.tsx` for metadata and visual layout.

## 4. Authentication Workflow
- Middleware `middleware.ts` handles all protection logic.
- Protected routes MUST be inside `app/(dashboard)/dashboard/`.
