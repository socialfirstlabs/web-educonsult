-- Add image_url to services (not locale-specific)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url text;

-- Add tags to services (English default)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tags text;

-- Add tags to service_translations (locale-specific)
ALTER TABLE public.service_translations ADD COLUMN IF NOT EXISTS tags text;
