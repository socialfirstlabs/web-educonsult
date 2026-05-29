import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position is required"),
  image_url: z.string().url("Valid image URL is required").or(z.literal("")),
  order_index: z.number().int().min(0),
  is_active: z.boolean(),
});

export type TeamMemberValues = z.infer<typeof teamMemberSchema>;
