import { z } from "zod";

export const moodSchema = z.object({
  id: z.number().int().positive().min(1),
  type: z.string(),
  emoji: z.string().emoji(),
  created_at: z.optional(z.number()),
  note: z.string().nullable(),
  user_id: z.string(),
});

export const streakSchema = z.object({
  id: z.number().int().positive().min(1),
  created_at: z.optional(z.number()), // Store UNIX timestamp in milliseconds
  updated_at: z.optional(z.date()), // Store UNIX timestamp in milliseconds
  streak_count: z.number().int().positive(),
  longest_streak: z.number().int().positive(),
  streak_status: z.boolean(),
  user_id: z.string(),
});

export type Mood = z.infer<typeof moodSchema>;
export type Streak = z.infer<typeof streakSchema>;

export const moodPostValidationSchema = moodSchema.omit({ id: true, user_id: true, created_at: true });
export const streakPostValidationSchema = streakSchema.omit({ id: true, user_id: true, created_at: true });

export const moodPostUpdateSchema = moodSchema.partial().omit({ id: true, created_at: true, user_id: true });
export const streakPostUpdateSchema = streakSchema.partial().omit({ id: true, created_at: true, user_id: true });
