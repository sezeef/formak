import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { formTable } from "@/db/schema/form";

export const formSubmissionTable = sqliteTable("formSubmission", {
  id: text("id").primaryKey(),
  formId: text("formId")
    .notNull()
    .references(() => formTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: text("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  )
});

export type InsertForm = typeof formSubmissionTable.$inferInsert;
export type SelectForm = typeof formSubmissionTable.$inferSelect;
