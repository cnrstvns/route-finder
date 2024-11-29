CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar,
	"email_address" varchar,
	"profile_picture_url" varchar,
	"updated_at" integer,
	"created_at" integer,
	"requested_deletion_at" integer,
	CONSTRAINT "user_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "user_email_address_unique" UNIQUE("email_address")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_id_index" ON "user" ("clerk_id");