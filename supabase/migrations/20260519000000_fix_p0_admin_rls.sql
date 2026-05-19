-- =============================================================================
-- Migration: P0 Security Fix — Admin-Only RLS Policies
-- File:      supabase/migrations/20260519000000_fix_p0_admin_rls.sql
-- =============================================================================
--
-- PROBLEM (P0): All write RLS policies previously used:
--   TO authenticated USING (true)
-- This means ANY registered Supabase user could modify all data,
-- not just designated admins.
--
-- SOLUTION: Restrict write access to users with app_metadata.role = 'admin'.
-- app_metadata is set ONLY by service-role or the Supabase Dashboard —
-- it CANNOT be self-assigned by a regular user (unlike user_metadata).
--
-- HOW TO SET ADMIN ROLE FOR A USER:
--   Option A (Supabase Dashboard):
--     Authentication → Users → select user → Edit → set app_metadata:
--     { "role": "admin" }
--
--   Option B (SQL — run in Supabase SQL Editor):
--     UPDATE auth.users
--     SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
--     WHERE email = 'your-admin@email.com';
--
-- ALSO RECOMMENDED (Supabase Dashboard):
--   Authentication → Settings → Auth → Disable "Enable Email Signup"
--   This prevents anyone from self-registering an account entirely.
-- =============================================================================

-- Helper: A reusable function to check admin role from JWT app_metadata.
-- Using a function keeps policies readable and easy to update centrally.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin';
$$;

-- Grant execute permission so RLS policies can call it.
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =============================================================================
-- LEADS TABLE
-- =============================================================================
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Note: Public INSERT policy is intentionally unchanged — anyone can submit a lead.

-- =============================================================================
-- BLOG POSTS
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage blogs" ON public.blog_posts;
CREATE POLICY "Admins manage blogs"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- BLOG TRANSLATIONS
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage blog translations" ON public.blog_translations;
CREATE POLICY "Admins manage blog translations"
  ON public.blog_translations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SUCCESS STORIES
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage success stories" ON public.success_stories;
CREATE POLICY "Admins manage success stories"
  ON public.success_stories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SUCCESS STORY TRANSLATIONS
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage success story translations" ON public.success_story_translations;
CREATE POLICY "Admins manage success story translations"
  ON public.success_story_translations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SERVICES
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SERVICE TRANSLATIONS
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage service translations" ON public.service_translations;
CREATE POLICY "Admins manage service translations"
  ON public.service_translations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- COURSES
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Admins manage courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- COURSE TRANSLATIONS
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage course translations" ON public.course_translations;
CREATE POLICY "Admins manage course translations"
  ON public.course_translations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- SITE CONFIG
-- =============================================================================
DROP POLICY IF EXISTS "Admins manage site config" ON public.site_config;
CREATE POLICY "Admins manage site config"
  ON public.site_config
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- STORAGE — images bucket
-- =============================================================================
-- Update storage policies to also use the admin role check.
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
CREATE POLICY "Admins can update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' AND public.is_admin())
  WITH CHECK (bucket_id = 'images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images' AND public.is_admin());

-- =============================================================================
-- VERIFICATION QUERY
-- Run this after applying the migration to confirm policies are updated:
-- =============================================================================
-- SELECT schemaname, tablename, policyname, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN (
--   'leads','blog_posts','blog_translations','success_stories',
--   'success_story_translations','services','service_translations',
--   'courses','course_translations','site_config'
-- )
-- ORDER BY tablename, cmd;
