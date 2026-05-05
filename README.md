# EduNepal Consultancy Lead System

EduNepal Consultancy Lead System is a comprehensive platform for educational consultancies to manage leads, courses, services, blog posts, and success stories. It features a modern, high-performance public website for lead generation and a powerful admin dashboard for back-office management.

## 🚀 Key Features

### Public Website

- **Modern Landing Page:** Highlight services, courses, and success stories.
- **Lead Generation:** Interactive forms for student inquiries and language class registrations.
- **Service Pages:** Dedicated pages for study abroad programs (e.g., Study in Japan).
- **Blog & Success Stories:** Dynamic content to engage potential leads and showcase success.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.

### Admin Dashboard

- **Lead Management:** View and manage incoming inquiries from potential students.
- **Content Management System (CMS):** Easy management of blog posts, success stories, services, and courses.
- **Image Uploads:** Built-in support for managing images via Supabase Storage.
- **Authentication:** Secure login for admin users powered by Supabase Auth.
- **Real-time Updates:** Seamless data management with Server Actions and revalidation.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Frontend:** [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Backend:** [Supabase](https://supabase.com/) (Auth, DB, Storage)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## ⚙️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A Supabase account and project

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/edu-web.git
    cd edu-web
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Environment Setup:**
    - Copy `.env.example` to `.env.local`:

        ```bash
        cp .env.example .env.local
        ```

    - Fill in your Supabase credentials in `.env.local`.

4. **Database Setup:**
    - Run the SQL schema provided in `supabase.md` in your Supabase SQL Editor.
    - Ensure the `images` bucket is created in Supabase Storage with public access.

5. **Run the development server:**

    ```bash
    npm run dev
    ```

6. **Build for production:**

    ```bash
    npm run build
    ```

## 📁 Project Structure

```text
edu-web/
├─ .env.example
├─ .env.local
├─ .gitignore
├─ AGENTS.md
├─ GEMINI.md
├─ MEMORY.md
├─ README.md
├─ build-log.txt
├─ components.json
├─ eslint.config.mjs
├─ fetch-form.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ proxy.ts
├─ supabase.md
├─ tsconfig.json
├─ tsconfig.tsbuildinfo
├─ agent/
│  ├─ REASONING.md
│  ├─ SAFETY.md
│  ├─ SKILL.md
│  └─ WORKFLOWS.md
├─ app/
│  ├─ (dashboard)/
│  │  └─ dashboard/
│  │     ├─ blog/
│  │     │  └─ page.tsx
│  │     ├─ courses/
│  │     │  └─ page.tsx
│  │     ├─ leads/
│  │     │  └─ page.tsx
│  │     ├─ services/
│  │     │  └─ page.tsx
│  │     ├─ success-stories/
│  │     │  └─ page.tsx
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ (website)/
│  │  ├─ blog/
│  │  │  ├─ [slug]/
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ contact/
│  │  │  └─ page.tsx
│  │  ├─ language-classes/
│  │  │  └─ page.tsx
│  │  ├─ services/
│  │  │  └─ page.tsx
│  │  ├─ study-in-japan/
│  │  │  └─ page.tsx
│  │  ├─ success-stories/
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ login/
│  │  └─ page.tsx
│  ├─ favicon.ico
│  ├─ favicon.png
│  ├─ globals.css
│  └─ layout.tsx
├─ components/
│  ├─ dashboard/
│  │  ├─ CourseClient.tsx
│  │  ├─ CourseForm.tsx
│  │  ├─ CourseList.tsx
│  │  ├─ LogoutButton.tsx
│  │  ├─ ServiceClient.tsx
│  │  ├─ ServiceForm.tsx
│  │  ├─ ServiceList.tsx
│  │  ├─ SuccessStoryClient.tsx
│  │  ├─ SuccessStoryForm.tsx
│  │  └─ SuccessStoryList.tsx
│  ├─ shared/
│  ├─ ui/
│  │  ├─ alert.tsx
│  │  ├─ avatar.tsx
│  │  ├─ badge.tsx
│  │  ├─ button.tsx
│  │  ├─ card.tsx
│  │  ├─ dialog.tsx
│  │  ├─ dropdown-menu.tsx
│  │  ├─ form.tsx
│  │  ├─ input.tsx
│  │  ├─ label.tsx
│  │  ├─ select.tsx
│  │  ├─ switch.tsx
│  │  ├─ table.tsx
│  │  └─ textarea.tsx
│  └─ website/
│     └─ LeadForm.tsx
├─ docs/
│  └─ superpowers/
│     └─ plans/
│        └─ 2026-03-16-first-version-release.md
├─ error/
│  ├─ errors.txt
│  └─ errors2.txt
├─ lib/
│  ├─ actions/
│  │  ├─ auth.action.ts
│  │  ├─ course.action.ts
│  │  ├─ lead.action.ts
│  │  ├─ service.action.ts
│  │  ├─ storage.action.ts
│  │  └─ success-story.action.ts
│  ├─ prisma/
│  ├─ services/
│  ├─ supabase/
│  │  ├─ client.ts
│  │  └─ server.ts
│  ├─ validations/
│  │  ├─ course.schema.ts
│  │  ├─ lead.schema.ts
│  │  ├─ service.schema.ts
│  │  └─ success-story.schema.ts
│  ├─ constants.ts
│  └─ utils.ts
├─ prisma/
│  └─ migrations/
│     └─ 20260425160000_init/
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ supabase/
│  ├─ .gitignore
│  ├─ config.toml
│  └─ migrations/
└─ types/
```

Note: Generated/local folders like `.git/`, `node_modules/`, and `.next/` exist but are intentionally not expanded here.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For inquiries, please contact EduNepal Consultancy.
