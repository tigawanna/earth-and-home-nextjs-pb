CREATE TABLE `direct_conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_lower_id` text NOT NULL,
	`user_higher_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_lower_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_higher_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `direct_conversations_pair_uidx` ON `direct_conversations` (`user_lower_id`,`user_higher_id`);--> statement-breakpoint
CREATE INDEX `direct_conversations_user_lower_idx` ON `direct_conversations` (`user_lower_id`);--> statement-breakpoint
CREATE INDEX `direct_conversations_user_higher_idx` ON `direct_conversations` (`user_higher_id`);--> statement-breakpoint
CREATE TABLE `direct_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_user_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `direct_conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `direct_messages_conversation_id_idx` ON `direct_messages` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `direct_messages_sender_idx` ON `direct_messages` (`sender_user_id`);