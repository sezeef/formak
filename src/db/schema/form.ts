import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "@/db/schema/user";

export const formTable = sqliteTable("form", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull(),
  name: text("name")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  content: text("content").notNull(),
  shareUrl: text("shareUrl").notNull(),
  visits: integer("visits").notNull(),
  submissions: integer("submissions").notNull(),
  createdAt: text("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  )
});

export type InsertForm = typeof formTable.$inferInsert;
export type SelectForm = typeof formTable.$inferSelect;
