import { z } from "zod";

export const moodSchema = z.object({
  id: z.number().int().positive().min(1),
  type: z.string(),
  emoji: z.string().emoji(),
  created_at: z.optional(z.number()),
  note: z.string().nullable(),
  user_id: z.string(),
});

export type Mood = z.infer<typeof moodSchema>;

export const createPostSchema = moodSchema.omit({ id: true, user_id: true, created_at: true });
export const updatePostSchema = moodSchema.partial().omit({ id: true, created_at: true, user_id: true });
