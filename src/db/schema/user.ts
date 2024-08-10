import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey
} from "drizzle-orm/sqlite-core";
import { formTable } from "@/db/schema/form";

export const USER_ROLES = {
  ADMIN: "ADMIN",
  DEV: "DEV",
  USER: "USER",
  GUEST: "GUEST"
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const userRoles = [
  USER_ROLES.ADMIN,
  USER_ROLES.DEV,
  USER_ROLES.USER,
  USER_ROLES.GUEST
] as const;

export const userTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: userRoles }).notNull().default(USER_ROLES.USER),
  password: text("password").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  createdAt: text("createdAt")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  )
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export const verificationTokenTable = sqliteTable(
  "verification-token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull()
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.id, vt.token] })
  })
);

export type InsertVerificationToken =
  typeof verificationTokenTable.$inferInsert;

export const passwordResetTokenTable = sqliteTable(
  "password-reset-token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull()
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.id, vt.token] })
  })
);

export const twoFactorTokenTable = sqliteTable(
  "two-factor-token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull()
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.id, vt.token] })
  })
);

export const twoFactorConfirmationTable = sqliteTable(
  "two-factor-confirmation",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" })
  }
);

export const userRelations = relations(userTable, ({ one, many }) => ({
  twoFactorConfirmations: one(twoFactorConfirmationTable, {
    fields: [userTable.id],
    references: [twoFactorConfirmationTable.userId]
  }),
  posts: many(formTable)
}));
