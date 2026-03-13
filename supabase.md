# Supabase Setup Guide for EduNepal Consultancy

Follow these steps to configure the Supabase backend for your lead generation and management system.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign in.
2. Click **"New Project"** and select your organization.
3. **Name:** `edu-web-backend` (or your preferred name).
4. **Database Password:** (Save this securely).
5. **Region:** Choose the one closest to Nepal (e.g., Mumbai or Singapore).
6. Click **"Create new project"**. Wait 1–2 minutes for the database to provision.

## Step 2: Set Up the Database Schema

Once the project is ready:
1. Go to the **SQL Editor** in the left sidebar.
2. Click **"New Query"**.
3. Paste and run the following SQL to create your tables and enable Row Level Security (RLS):

```sql
-- 1. Create Tables
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interested_country TEXT,
  course_interest TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  university_name TEXT,
  testimonial TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies
-- Leads: Anyone can submit (public), only logged-in admins can view.
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT TO authenticated USING (true);

-- Blog: Anyone can read published posts, only admins can manage.
CREATE POLICY "Public can view published blogs" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage blogs" ON public.blog_posts FOR ALL TO authenticated USING (true);

-- Success Stories: Anyone can read published stories, admins manage.
CREATE POLICY "Public can view published success stories" ON public.success_stories FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage success stories" ON public.success_stories FOR ALL TO authenticated USING (true);
```

## Step 3: Get Your API Keys

1. Go to **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL**.
3. Copy the **`anon` public key**.
4. Open your project's `.env.local` file and paste them:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create an Admin User

Since our dashboard is protected, you need an account to log in.
1. Go to **Authentication** -> **Users**.
2. Click **"Add User"** -> **"Create new user"**.
3. Enter your email and a strong password.
4. Uncheck "Confirm user email" (for quick testing) or confirm it via the email Supabase sends you.
5. Use these credentials on the `/login` page of your application.

## Step 5: Set Up Storage (For Blog Images & Student Photos)

1. Go to **Storage** in the sidebar.
2. Click **"New Bucket"**.
3. Name: `images`
4. Toggle **"Public"** to ON (so website visitors can see the photos).
5. Add a Policy to allow authenticated users (Admins) to upload files:
   - Click "Policies" -> "Storage Policies".
   - Select "Full access to authenticated users".

## Step 6: Verify the Connection

1. Start your local Next.js app: `npm run dev`.
2. Go to the **Contact Page** (`http://localhost:3000/contact`) and submit the form.
3. Go back to your Supabase Dashboard -> **Table Editor** -> **leads**.
4. You should see your form submission appear instantly.

---

## Pro Tip: Generate TypeScript Types

To ensure your Next.js code has strict typing for your database columns, run this command in your terminal (requires Supabase CLI):

```bash
npx supabase gen types typescript --project-id "your-project-ref" > types/supabase.ts
```
*(Replace `your-project-ref` with the ID from your Supabase Project URL).*
