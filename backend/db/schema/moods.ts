import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const moods = pgTable("moods_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: text().notNull(),
  type: text().notNull(),
  emoji: text().notNull(),
  note: text(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(), // Store UNIX timestamp in milliseconds
  newest: boolean().notNull().default(false),
});

// Schema for inserting a user - can be used to validate API requests
export const insertMoodsSchema = createInsertSchema(moods, {
  emoji: z.string().emoji(),
});
// Schema for selecting a Mood - can be used to validate API responses
export const selectMoodsSchema = createSelectSchema(moods);
