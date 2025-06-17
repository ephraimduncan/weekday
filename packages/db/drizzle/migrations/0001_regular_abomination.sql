ALTER TABLE "weekday_account" DROP CONSTRAINT "weekday_account_user_id_weekday_user_id_fk";
--> statement-breakpoint
ALTER TABLE "weekday_account" ADD COLUMN "name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "weekday_account" ADD COLUMN "email" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "weekday_account" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "weekday_user" ADD COLUMN "default_account_id" text;--> statement-breakpoint
ALTER TABLE "weekday_account" ADD CONSTRAINT "weekday_account_user_id_weekday_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."weekday_user"("id") ON DELETE cascade ON UPDATE no action;