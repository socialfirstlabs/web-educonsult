import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(200, "Excerpt must be less than 200 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  image_url: z.string().url("Valid image URL is required").or(z.literal("")),
  author_name: z.string().min(2, "Author name is required"),
  is_published: z.boolean(),
  published_at: z.string().optional().or(z.literal("")),
});

export type BlogValues = z.infer<typeof blogSchema>;
