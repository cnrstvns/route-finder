CREATE TABLE IF NOT EXISTS "airline" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"iata_code" varchar NOT NULL,
	CONSTRAINT "airline_iata_code_unique" UNIQUE("iata_code")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "iata_code_index" ON "airline" ("iata_code");