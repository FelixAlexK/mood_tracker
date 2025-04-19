import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const streaks = pgTable("streaks_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: text().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(), // Store UNIX timestamp in milliseconds
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(), // Store UNIX timestamp in milliseconds
  streak_count: integer().notNull().default(0),
  longest_streak: integer().notNull().default(0),
  streak_status: boolean().notNull().default(false),

});

// Schema for inserting a user - can be used to validate API requests
export const insertStreaksSchema = createInsertSchema(streaks);
// Schema for selecting a Mood - can be used to validate API responses
export const selectStreaksSchema = createSelectSchema(streaks);
