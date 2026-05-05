/**
 * Custom shared TypeScript types for the EduNepal project.
 *
 * Re-exports Supabase DB types and adds project-specific types.
 * Import from here instead of individual files: `import type { Lead } from "@/types"`.
 */

export type { Database, Tables, InsertDto, UpdateDto } from "./supabase";

// ---------------------------------------------------------------------------
// Domain types (extend as the project grows)
// ---------------------------------------------------------------------------

/** Supported application locales */
export type Locale = "en" | "ja" | "ne";

/** Lead status values */
export type LeadStatus = "new" | "contacted" | "converted" | "archived";

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
