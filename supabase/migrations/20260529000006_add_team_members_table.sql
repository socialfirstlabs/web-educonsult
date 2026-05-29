-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  position     text NOT NULL,
  image_url    text NOT NULL DEFAULT '',
  order_index  integer NOT NULL DEFAULT 0,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

-- Japanese translations
CREATE TABLE IF NOT EXISTS public.team_member_translations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  locale         text NOT NULL,
  name           text NOT NULL DEFAULT '',
  position       text NOT NULL DEFAULT '',
  UNIQUE (team_member_id, locale)
);

-- RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_translations ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read active team members"
  ON public.team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read team member translations"
  ON public.team_member_translations FOR SELECT
  USING (true);

-- Admin write
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage team member translations"
  ON public.team_member_translations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
