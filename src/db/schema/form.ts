import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { userTable } from "@/db/schema/user";
import { formSubmissionTable } from "@/db/schema/form-submission";

export const formTable = sqliteTable(
  "form",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    content: text("content"),
    shareUrl: text("shareUrl")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    visits: integer("visits").notNull().default(0),
    submissions: integer("submissions").notNull().default(0),
    published: integer("published", { mode: "boolean" }).default(false),
    createdAt: text("createdAt")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    )
  },
  (t) => ({
    unq: unique().on(t.userId, t.name)
  })
);

export type InsertForm = typeof formTable.$inferInsert;
export type SelectForm = typeof formTable.$inferSelect;

export const formRelations = relations(formTable, ({ one, many }) => ({
  owner: one(userTable, {
    fields: [formTable.userId],
    references: [userTable.id]
  }),
  submissions: many(formSubmissionTable)
}));
