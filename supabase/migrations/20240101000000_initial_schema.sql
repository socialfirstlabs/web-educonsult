-- =============================================================================
-- Initial Schema Migration
-- Creates all tables, enables RLS, and adds public read/write policies.
-- The admin-only write policies are added in the next migration file.
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- BLOG POSTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title         text NOT NULL,
    slug          text NOT NULL UNIQUE,
    excerpt       text,
    content       text NOT NULL,
    image_url     text,
    author_name   text NOT NULL DEFAULT 'J&N Team',
    is_published  boolean DEFAULT false,
    published_at  timestamptz,
    created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blogs"
    ON public.blog_posts FOR SELECT
    USING (is_published = true);

-- =============================================================================
-- BLOG TRANSLATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.blog_translations (
    id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id  uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    locale   text NOT NULL,
    title    text NOT NULL,
    slug     text NOT NULL,
    excerpt  text,
    content  text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (blog_id, locale)
);

ALTER TABLE public.blog_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blog translations"
    ON public.blog_translations FOR SELECT
    USING (true);

-- =============================================================================
-- COURSES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title        text NOT NULL,
    description  text NOT NULL,
    duration     text NOT NULL,
    schedule     text NOT NULL,
    fees         text NOT NULL,
    badge        text,
    is_published boolean DEFAULT false,
    order_index  integer,
    created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published courses"
    ON public.courses FOR SELECT
    USING (is_published = true);

-- =============================================================================
-- COURSE TRANSLATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.course_translations (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    locale      text NOT NULL,
    title       text NOT NULL,
    description text NOT NULL,
    duration    text,
    schedule    text,
    fees        text,
    badge       text,
    created_at  timestamptz DEFAULT now(),
    UNIQUE (course_id, locale)
);

ALTER TABLE public.course_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read course translations"
    ON public.course_translations FOR SELECT
    USING (true);

-- =============================================================================
-- LEADS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name               text NOT NULL,
    email              text NOT NULL,
    phone              text NOT NULL,
    interested_country text,
    course_interest    text,
    message            text,
    status             text DEFAULT 'new',
    created_at         timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (contact form)
CREATE POLICY "Anyone can submit a lead"
    ON public.leads FOR INSERT
    WITH CHECK (true);

-- =============================================================================
-- SERVICES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title       text NOT NULL,
    description text NOT NULL,
    features    text,
    icon_name   text NOT NULL,
    is_active   boolean DEFAULT true,
    order_index integer NOT NULL DEFAULT 0,
    created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active services"
    ON public.services FOR SELECT
    USING (is_active = true);

-- =============================================================================
-- SERVICE TRANSLATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.service_translations (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id  uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    locale      text NOT NULL,
    title       text NOT NULL,
    description text NOT NULL,
    features    text,
    created_at  timestamptz DEFAULT now(),
    UNIQUE (service_id, locale)
);

ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read service translations"
    ON public.service_translations FOR SELECT
    USING (true);

-- =============================================================================
-- SUCCESS STORIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.success_stories (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name        text NOT NULL,
    destination_country text NOT NULL,
    university_name     text,
    testimonial         text,
    image_url           text,
    is_published        boolean DEFAULT false,
    created_at          timestamptz DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published success stories"
    ON public.success_stories FOR SELECT
    USING (is_published = true);

-- =============================================================================
-- SUCCESS STORY TRANSLATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.success_story_translations (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    success_story_id    uuid NOT NULL REFERENCES public.success_stories(id) ON DELETE CASCADE,
    locale              text NOT NULL,
    student_name        text NOT NULL,
    destination_country text NOT NULL,
    university_name     text,
    testimonial         text,
    created_at          timestamptz DEFAULT now(),
    UNIQUE (success_story_id, locale)
);

ALTER TABLE public.success_story_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read success story translations"
    ON public.success_story_translations FOR SELECT
    USING (true);

-- =============================================================================
-- SITE CONFIG
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_config (
    key   text PRIMARY KEY,
    value text NOT NULL
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site config"
    ON public.site_config FOR SELECT
    USING (true);

-- =============================================================================
-- STORAGE — images bucket
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,
    52428800,   -- 50 MiB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Public read access for the images bucket
CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'images');
