// import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer
  // primaryKey
} from "drizzle-orm/sqlite-core";
// import { formTable } from "@/db/schema/form";

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
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role", { enum: userRoles }).notNull().default(USER_ROLES.USER),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;


export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id)
});

export const accountTable = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp"
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp"
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const verificationTable = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// export const verificationTokenTable = sqliteTable(
//   "verification-token",
//   {
//     id: text("id")
//       .notNull()
//       .$defaultFn(() => crypto.randomUUID()),
//     email: text("email").notNull().unique(),
//     token: text("token").notNull().unique(),
//     expires: integer("expires", { mode: "timestamp_ms" }).notNull()
//   },
//   (vt) => ({
//     pk: primaryKey({ columns: [vt.id, vt.token] })
//   })
// );
//
// export type InsertVerificationToken =
//   typeof verificationTokenTable.$inferInsert;

// export const passwordResetTokenTable = sqliteTable(
//   "password-reset-token",
//   {
//     id: text("id")
//       .notNull()
//       .$defaultFn(() => crypto.randomUUID()),
//     email: text("email").notNull().unique(),
//     token: text("token").notNull().unique(),
//     expires: integer("expires", { mode: "timestamp_ms" }).notNull()
//   },
//   (vt) => ({
//     pk: primaryKey({ columns: [vt.id, vt.token] })
//   })
// );

// export const twoFactorTokenTable = sqliteTable(
//   "two-factor-token",
//   {
//     id: text("id")
//       .notNull()
//       .$defaultFn(() => crypto.randomUUID()),
//     email: text("email").notNull().unique(),
//     token: text("token").notNull().unique(),
//     expires: integer("expires", { mode: "timestamp_ms" }).notNull()
//   },
//   (vt) => ({
//     pk: primaryKey({ columns: [vt.id, vt.token] })
//   })
// );

// export const twoFactorConfirmationTable = sqliteTable(
//   "two-factor-confirmation",
//   {
//     id: text("id")
//       .notNull()
//       .$defaultFn(() => crypto.randomUUID()),
//     userId: text("userId")
//       .notNull()
//       .references(() => userTable.id, { onDelete: "cascade" })
//   }
// );

// export const userRelations = relations(userTable, ({ one, many }) => ({
//   twoFactorConfirmations: one(twoFactorConfirmationTable, {
//     fields: [userTable.id],
//     references: [twoFactorConfirmationTable.userId]
//   }),
//   posts: many(formTable)
// }));
