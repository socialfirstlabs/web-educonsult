-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: add enrollments table
-- Stores applications submitted via the public Apply / Enroll Now modal.
-- Separate from `leads` so structured application data stays clean.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Helper: is_admin() ────────────────────────────────────────────────────────
-- Returns true when the calling JWT has app_metadata.role = 'admin'.
-- SECURITY DEFINER so it runs with the function owner's privileges, not the
-- caller's — safe because it only reads the caller's own JWT claims.
-- CREATE OR REPLACE is idempotent; safe to re-run if already present.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

CREATE TABLE IF NOT EXISTS public.enrollments (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name       TEXT        NOT NULL,
  last_name        TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  phone            TEXT        NOT NULL,
  japanese_level   TEXT        NOT NULL,
  program_interest TEXT        NOT NULL,
  -- workflow status: pending → reviewing → contacted → enrolled | rejected
  status           TEXT        NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Anyone (unauthenticated) may INSERT — the public application form uses anon key
CREATE POLICY "Public can submit enrollments"
  ON public.enrollments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admin users may SELECT
CREATE POLICY "Admins can read enrollments"
  ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only admin users may UPDATE (e.g. change status)
CREATE POLICY "Admins can update enrollments"
  ON public.enrollments
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admin users may DELETE
CREATE POLICY "Admins can delete enrollments"
  ON public.enrollments
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
