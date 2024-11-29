CREATE TABLE IF NOT EXISTS "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"feedback_text" varchar NOT NULL,
	"created_at" timestamp with time zone
);

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "icao_code" ON "airport" ("icao_code");

--> statement-breakpoint
DO $ $ BEGIN
ALTER TABLE
	"feedback"
ADD
	CONSTRAINT "feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;

EXCEPTION
WHEN duplicate_object THEN null;

END $ $;