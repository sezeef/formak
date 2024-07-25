CREATE TABLE IF NOT EXISTS `password-reset-token` (
    `id` text NOT NULL,
    `email` text NOT NULL,
    `token` text NOT NULL,
    `expires` integer NOT NULL,
    PRIMARY KEY(`id`, `token`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `two-factor-confirmation` (
    `id` text NOT NULL,
    `userId` text NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `two-factor-token` (
    `id` text NOT NULL,
    `email` text NOT NULL,
    `token` text NOT NULL,
    `expires` integer NOT NULL,
    PRIMARY KEY(`id`, `token`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `verification-token` (
    `id` text NOT NULL,
    `email` text NOT NULL,
    `token` text NOT NULL,
    `expires` integer NOT NULL,
    PRIMARY KEY(`id`, `token`)
);
--> statement-breakpoint
ALTER TABLE `form` ADD `published` integer DEFAULT false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `password-reset-token_email_unique` ON `password-reset-token` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `password-reset-token_token_unique` ON `password-reset-token` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `two-factor-token_email_unique` ON `two-factor-token` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `two-factor-token_token_unique` ON `two-factor-token` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `verification-token_email_unique` ON `verification-token` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `verification-token_token_unique` ON `verification-token` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_email_unique` ON `user` (`email`);
