-- Rename destination_country → destination
ALTER TABLE public.success_stories RENAME COLUMN destination_country TO destination;
ALTER TABLE public.success_story_translations RENAME COLUMN destination_country TO destination;

-- Rename university_name → company_name
ALTER TABLE public.success_stories RENAME COLUMN university_name TO company_name;
ALTER TABLE public.success_story_translations RENAME COLUMN university_name TO company_name;
