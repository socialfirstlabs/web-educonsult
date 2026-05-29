import { z } from "zod";

export const enrollmentSchema = z.object({
  first_name:       z.string().min(1, "First name is required"),
  last_name:        z.string().min(1, "Last name is required"),
  email:            z.string().email("Invalid email address"),
  phone:            z.string().min(7, "Phone number is required"),
  japanese_level:   z.string().min(1, "Please select your language level"),
  program_interest: z.string().min(1, "Please select a program"),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
