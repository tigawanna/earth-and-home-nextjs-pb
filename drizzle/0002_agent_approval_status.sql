ALTER TABLE `agents` ADD `approval_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX `agents_approval_status_idx` ON `agents` (`approval_status`);--> statement-breakpoint
UPDATE `agents` SET `approval_status` = 'approved' WHERE `is_verified` = 1;--> statement-breakpoint
UPDATE `user` SET `role` = 'agent' WHERE `id` IN (SELECT `user_id` FROM `agents` WHERE `approval_status` = 'approved') AND (`role` IS NULL OR `role` = 'user');