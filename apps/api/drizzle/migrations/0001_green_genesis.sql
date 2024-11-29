CREATE TABLE IF NOT EXISTS "aircraft" (
	"id" serial PRIMARY KEY NOT NULL,
	"iata_code" varchar NOT NULL,
	"model_name" varchar NOT NULL,
	CONSTRAINT "aircraft_iata_code_unique" UNIQUE("iata_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "airport" (
	"id" serial PRIMARY KEY NOT NULL,
	"iata_code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"country" varchar NOT NULL,
	CONSTRAINT "airport_iata_code_unique" UNIQUE("iata_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "route" (
	"id" serial PRIMARY KEY NOT NULL,
	"airline_iata" varchar NOT NULL,
	"origin_iata" varchar NOT NULL,
	"destination_iata" varchar NOT NULL,
	"aircraft_codes" varchar NOT NULL,
	"average_duration" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "iata_code_index" ON "aircraft" ("iata_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "iata_code_index" ON "airport" ("iata_code");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "route" ADD CONSTRAINT "route_airline_iata_airline_iata_code_fk" FOREIGN KEY ("airline_iata") REFERENCES "airline"("iata_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "route" ADD CONSTRAINT "route_origin_iata_airport_iata_code_fk" FOREIGN KEY ("origin_iata") REFERENCES "airport"("iata_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "route" ADD CONSTRAINT "route_destination_iata_airport_iata_code_fk" FOREIGN KEY ("destination_iata") REFERENCES "airport"("iata_code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
