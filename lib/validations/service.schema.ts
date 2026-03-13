import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon_name: z.string(),
  is_active: z.boolean(),
  order_index: z.number().int(),
});

export type ServiceValues = z.infer<typeof serviceSchema>;
