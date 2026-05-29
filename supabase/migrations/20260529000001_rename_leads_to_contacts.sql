-- Rename leads table to contacts and drop unused columns
-- Apply with: npx supabase db push

ALTER TABLE public.leads RENAME TO contacts;

ALTER TABLE public.contacts
  DROP COLUMN IF EXISTS interested_country,
  DROP COLUMN IF EXISTS course_interest;
