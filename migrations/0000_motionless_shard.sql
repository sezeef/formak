CREATE TABLE `formSubmission` (
	`id` text PRIMARY KEY NOT NULL,
	`formId` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`formId`) REFERENCES `form`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `form` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`shareUrl` text NOT NULL,
	`visits` integer NOT NULL,
	`submissions` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`name`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer
);
