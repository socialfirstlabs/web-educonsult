# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-16

### Added
- **Enhanced Blog CMS:** Fully functional blog management in the admin dashboard.
- **Dynamic Author Attribution:** Automatically detect and assign the author based on the logged-in admin.
- **Advanced SEO & AEO:** 
  - Dynamic OpenGraph and Twitter metadata for each post.
  - JSON-LD `BlogPosting` structured data for search engines and AI agents.
  - Breadcrumb navigation for improved site hierarchy.
  - Reading time estimation for better user engagement.
- **Feature Flag System:** Added `NEXT_PUBLIC_ENABLE_BLOG` environment variable to toggle the blog section globally.

### Fixed
- Resolved `next/image` hostname configuration issues for Supabase storage.
- Fixed TypeScript type mismatches in form resolvers and server actions.
- Cleaned up unused imports and linting warnings across the codebase.

## [1.0.0] - 2026-03-16

### Added
- **Initial Release** of the EduNepal Consultancy Lead System.
- **Public Website:** Home, Services, Study in Japan, Language Classes, Blog, Contact, and Success Stories pages.
- **Admin Dashboard:** Secure lead management, blog posts, courses, services, and success stories management.
- **Lead Generation:** Integration of `LeadForm` across public pages.
- **Authentication:** Supabase Auth for admin access.
- **Database:** Supabase PostgreSQL with Row Level Security (RLS).
- **Storage:** Supabase Storage for image uploads.
- **Styling:** Modern UI using Tailwind CSS 4 and `shadcn/ui`.
- **Validation:** Server-side validation using Zod and React Hook Form.
