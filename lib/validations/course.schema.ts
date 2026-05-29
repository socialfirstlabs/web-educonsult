import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().min(1, "Icon is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  schedule: z.string().optional().or(z.literal("")),
  fees: z.string().optional().or(z.literal("")),
  badge: z.string().optional().or(z.literal("")),
  is_published: z.boolean(),
  order_index: z.number().int(),
});

export type CourseValues = z.infer<typeof courseSchema>;
