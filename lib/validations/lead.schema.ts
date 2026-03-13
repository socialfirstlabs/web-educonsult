import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  interested_country: z.string().optional(),
  course_interest: z.string().optional(),
  message: z.string().min(10, "Please provide more details (min 10 characters)"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
