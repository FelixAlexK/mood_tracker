import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const moods = sqliteTable("moods_table", {
  id: int().primaryKey({ autoIncrement: true }),
  userID: text("user_id").notNull(),
  type: text().notNull(),
  emoji: text().notNull(),
  note: text(),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`), // Store UNIX timestamp in milliseconds
});

// Schema for inserting a user - can be used to validate API requests
export const insertMoodsSchema = createInsertSchema(moods, {
  emoji: z.string().emoji(),
});
// Schema for selecting a Mood - can be used to validate API responses
export const selectMoodsSchema = createSelectSchema(moods);
