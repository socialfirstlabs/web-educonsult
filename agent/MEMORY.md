# MEMORY.md - Project Knowledge Base

This file tracks the "Education Consultancy" domain knowledge and technical context.

## 1. Domain Knowledge
- **Consultancy Name:** EduNepal Consultancy.
- **Office Location:** Putalisadak, Kathmandu, Nepal.
- **Core Offerings:** Study in Japan, Japanese Language (N5, N4, N3), Visa Counseling.
- **Key Dates:** Intake months for Japan (April, July, October, January).

## 2. Technical Context
- **Framework:** Next.js 16 (App Router) + React 19.
- **Styling:** Tailwind CSS 4 + shadcn/ui.
- **Backend:** Supabase (Postgres, Auth, Storage).
- **Validation:** Zod + react-hook-form.

## 3. Database Schema (Key Tables)
- `leads`: Inquiries from the website.
- `blog_posts`: Content for the blog section.
- `success_stories`: Student testimonials and destination details.
- `services`: Consultancy offerings (Study in Japan, etc.).
- `courses`: Language class details (N5, N4, N3).
- `storage.objects`: (Bucket: `images`) for all media.

## 3. Persistent Business Logic
- **Lead Statuses:** New, Contacted, Counseling, Converted.
- **Course Durations:** Standard 6 months (N5/N4), 8 months (N3).
- **Timezone:** Asia/Kathmandu (Use for audit timestamps).
