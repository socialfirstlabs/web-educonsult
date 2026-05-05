# lib/prisma

> **Status: Not in use.**

This directory is reserved for future Prisma ORM integration if the project ever migrates away from direct Supabase client queries.

**Current data access:** All database interactions go through the Supabase client in `lib/supabase/` via Server Actions in `lib/actions/`.

**If you add Prisma here in the future:**
1. Run `npx prisma init` in the project root.
2. Move `schema.prisma` here or reference it with `prisma.schema` config.
3. Add `DATABASE_URL` to `.env.local` (see `.env.example`).
