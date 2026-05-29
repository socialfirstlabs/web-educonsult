import { z } from 'zod';

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  message: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Message is too long (max 1000 characters)"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
