import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(2, "Duration is required"),
  schedule: z.string().min(2, "Schedule is required"),
  fees: z.string().min(2, "Fees information is required"),
  badge: z.string().optional(),
  is_published: z.boolean(),
  order_index: z.number().int(),
});

export type CourseValues = z.infer<typeof courseSchema>;
