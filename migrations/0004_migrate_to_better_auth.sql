-- Migration: Migrate from auth.js to better-auth
-- Drop old auth.js tables
DROP TABLE IF EXISTS `password-reset-token`;
--> statement-breakpoint
DROP TABLE IF EXISTS `two-factor-confirmation`;
--> statement-breakpoint
DROP TABLE IF EXISTS `two-factor-token`;
--> statement-breakpoint
DROP TABLE IF EXISTS `verification-token`;
--> statement-breakpoint

-- Create new better-auth tables
CREATE TABLE IF NOT EXISTS `session` (
  `id` text PRIMARY KEY NOT NULL,
  `expires_at` integer NOT NULL,
  `token` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  `ip_address` text,
  `user_agent` text,
  `user_id` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `account` (
  `id` text PRIMARY KEY NOT NULL,
  `account_id` text NOT NULL,
  `provider_id` text NOT NULL,
  `user_id` text NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `id_token` text,
  `access_token_expires_at` integer,
  `refresh_token_expires_at` integer,
  `scope` text,
  `password` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `verification` (
  `id` text PRIMARY KEY NOT NULL,
  `identifier` text NOT NULL,
  `value` text NOT NULL,
  `expires_at` integer NOT NULL,
  `created_at` integer,
  `updated_at` integer
);
--> statement-breakpoint

-- Create indexes for better-auth tables
CREATE UNIQUE INDEX IF NOT EXISTS `session_token_unique` ON `session` (`token`);
--> statement-breakpoint

-- Update user table to add isAnonymous if not exists (better-auth compatibility)
-- Note: SQLite doesn't support ALTER COLUMN, so we check if the column exists first
-- The isAnonymous column should already exist in the user table from the schema
