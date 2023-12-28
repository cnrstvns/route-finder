CREATE TABLE IF NOT EXISTS "user_route" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"route_id" varchar NOT NULL,
	CONSTRAINT "user_route_index" UNIQUE("route_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_route" ADD CONSTRAINT "user_route_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_route" ADD CONSTRAINT "user_route_route_id_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
