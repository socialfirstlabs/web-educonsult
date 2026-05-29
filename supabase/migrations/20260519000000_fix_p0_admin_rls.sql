-- =============================================================================
-- P0 Fix: Admin RLS policies
-- Creates the is_admin() helper function and adds admin-only write policies
-- for every content table.  Also adds admin SELECT on contacts/leads so the
-- dashboard can read submissions.
--
-- Run AFTER the initial schema migration (20240101000000_initial_schema.sql).
-- =============================================================================

-- ─── Helper function ──────────────────────────────────────────────────────────
-- SECURITY DEFINER means this function runs with the OWNER's privileges, not
-- the calling user's.  It reads the JWT app_metadata set by the Supabase admin
-- SDK — regular users cannot self-assign this value.
-- CREATE OR REPLACE is idempotent so safe to re-run.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public   -- prevents search_path injection
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ─── BLOG POSTS ───────────────────────────────────────────────────────────────
-- Admins need full SELECT (dashboard shows all posts, not just published).
CREATE POLICY "Admins can manage blog posts"
    ON public.blog_posts FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── BLOG TRANSLATIONS ────────────────────────────────────────────────────────
CREATE POLICY "Admins can manage blog translations"
    ON public.blog_translations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── COURSES ──────────────────────────────────────────────────────────────────
CREATE POLICY "Admins can manage courses"
    ON public.courses FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── COURSE TRANSLATIONS ──────────────────────────────────────────────────────
CREATE POLICY "Admins can manage course translations"
    ON public.course_translations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── SERVICES ─────────────────────────────────────────────────────────────────
CREATE POLICY "Admins can manage services"
    ON public.services FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── SERVICE TRANSLATIONS ─────────────────────────────────────────────────────
CREATE POLICY "Admins can manage service translations"
    ON public.service_translations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── SUCCESS STORIES ──────────────────────────────────────────────────────────
CREATE POLICY "Admins can manage success stories"
    ON public.success_stories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── SUCCESS STORY TRANSLATIONS ───────────────────────────────────────────────
CREATE POLICY "Admins can manage success story translations"
    ON public.success_story_translations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── LEADS / CONTACTS ─────────────────────────────────────────────────────────
-- Public INSERT is already in the initial schema.
-- Admins need SELECT (dashboard contacts list) and UPDATE/DELETE (status changes).
CREATE POLICY "Admins can read and manage leads"
    ON public.leads FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── SITE CONFIG ──────────────────────────────────────────────────────────────
CREATE POLICY "Admins can manage site config"
    ON public.site_config FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── STORAGE — images bucket ──────────────────────────────────────────────────
-- Public SELECT is already in the initial schema.
-- Upload/update/delete require an authenticated session only (not is_admin()).
-- Rationale: proxy.ts + the uploadImage() server action already enforce auth
-- at the application layer. Requiring is_admin() here would break uploads for
-- any admin whose app_metadata hasn't been manually set yet.
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
