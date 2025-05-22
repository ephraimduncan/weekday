CREATE TABLE "weekday_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "weekday_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp with time zone,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "weekday_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "weekday_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"is_premium" boolean DEFAULT false NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "weekday_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weekday_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "weekday_account" ADD CONSTRAINT "weekday_account_user_id_weekday_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."weekday_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekday_session" ADD CONSTRAINT "weekday_session_user_id_weekday_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."weekday_user"("id") ON DELETE no action ON UPDATE no action;