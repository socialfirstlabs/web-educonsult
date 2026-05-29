import { z } from "zod";

export const successStorySchema = z.object({
  student_name: z.string().min(2, "Student name must be at least 2 characters"),
  destination: z.string().min(2, "Destination is required"),
  company_name: z.string().optional().or(z.literal("")),
  testimonial: z.string().min(10, "Testimonial must be at least 10 characters"),
  image_url: z.string().url("Valid image URL is required").or(z.literal("")),
  is_published: z.boolean(),
});

export type SuccessStoryValues = z.infer<typeof successStorySchema>;
