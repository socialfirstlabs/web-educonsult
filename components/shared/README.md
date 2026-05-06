# components/shared

> **Status: Reserved for cross-cutting UI components.**

This directory holds components that are used in **both** the public website (`components/website/`) and the admin dashboard (`components/dashboard/`).

**Examples of what belongs here:**
- `LoadingSpinner.tsx` — generic loading state
- `EmptyState.tsx` — empty data feedback UI
- `ConfirmDialog.tsx` — reusable confirmation modal
- `ImageUpload.tsx` — shared image upload widget (used in forms on both sides)
- `StatusBadge.tsx` — colored status labels (e.g., lead status)

**Do NOT put here:**
- Components that only appear on the public site → `components/website/`
- Components that only appear in the dashboard → `components/dashboard/`
- Base shadcn/ui primitives → `components/ui/`
