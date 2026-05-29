/**
 * Custom shared TypeScript types for the EduNepal project.
 *
 * Re-exports Supabase DB types and adds project-specific types.
 * Import from here instead of individual files: `import type { Contact } from "@/types"`.
 *
 * NOTE: supabase-v1.ts is auto-generated. Do NOT edit it manually.
 * Regenerate with: npx supabase gen types typescript --linked > types/supabase-v1.ts
 */

export type { Database, Tables, TablesInsert, TablesUpdate, Enums } from "./supabase-v1";

// ---------------------------------------------------------------------------
// Convenience row-type aliases (auto-derived from generated types)
// ---------------------------------------------------------------------------

import type { Tables as T } from "./supabase-v1";

/** A single contact submission from the public contact form */
export type Contact = T<"contacts">;

/** A blog post record (English base content) */
export type BlogPost = T<"blog_posts">;

/** A blog post translation for a specific locale */
export type BlogTranslation = T<"blog_translations">;

/** A service record (English base content) */
export type Service = T<"services">;

/** A service translation for a specific locale */
export type ServiceTranslation = T<"service_translations">;

/** A course record (English base content) */
export type Course = T<"courses">;

/** A course translation for a specific locale */
export type CourseTranslation = T<"course_translations">;

/** A success story record (English base content) */
export type SuccessStory = T<"success_stories">;

/** A success story translation for a specific locale */
export type SuccessStoryTranslation = T<"success_story_translations">;

/** A site configuration key/value pair */
export type SiteConfig = T<"site_config">;

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Supported application locales */
export type Locale = "en" | "ja";

/** Contact status values */
export type ContactStatus = "new" | "contacted" | "converted" | "archived";

/** Image upload result returned from storage action */
export interface UploadResult {
  url: string;
  path: string;
  error: string | null;
}

/** Generic paginated response wrapper */
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
