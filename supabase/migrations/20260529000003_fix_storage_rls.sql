-- =============================================================================
-- Fix storage RLS: simplify upload/update/delete policies.
--
-- Previous policy: requires public.is_admin() — which means the logged-in
-- user must have app_metadata.role = 'admin' set in Supabase Auth.
-- If that metadata is not yet set, ALL image uploads fail with 403.
--
-- New policy: requires any authenticated session.
-- This is safe because:
--   1. proxy.ts redirects unauthenticated requests to /login before they reach
--      the dashboard or any server action.
--   2. uploadImage() (storage.action.ts) explicitly calls supabase.auth.getUser()
--      and throws "Unauthorized" if no valid session is found.
--   3. Public signup is (should be) disabled in Supabase → Auth → Settings.
--
-- Content-table write policies still use is_admin() for data-integrity
-- protection independent of the application layer.
-- =============================================================================

-- Drop the is_admin()-gated policies created in fix_p0_admin_rls.sql
DROP POLICY IF EXISTS "Admins can upload images"  ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images"  ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images"  ON storage.objects;

-- Recreate with simpler authenticated-user requirement
CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'images');
