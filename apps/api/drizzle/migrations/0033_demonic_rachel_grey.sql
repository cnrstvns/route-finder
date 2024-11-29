DO $$ BEGIN
 CREATE TYPE "provider" AS ENUM('google', 'discord');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" "provider" NOT NULL,
	"state" varchar(50) NOT NULL,
	CONSTRAINT "oauth_session_state_unique" UNIQUE("state")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"expires_at" timestamp with time zone,
	"token" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_clerk_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "clerk_id_index";--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "state_index" ON "oauth_session" ("state");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "clerk_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "requested_deletion_at";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
