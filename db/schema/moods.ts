
import { index, int, sqliteTable, text, } from "drizzle-orm/sqlite-core";

export const moods = sqliteTable('moods_table', {
    id: int().primaryKey({ autoIncrement: true }),
    userID: text('user_id').notNull(),
    level: text().notNull(),
    emoji: text().notNull(),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    note: text(),
})

