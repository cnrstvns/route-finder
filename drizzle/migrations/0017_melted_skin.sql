ALTER TABLE "airport" ADD COLUMN "icao_code" varchar;--> statement-breakpoint
ALTER TABLE "airport" ADD CONSTRAINT "airport_icao_code_unique" UNIQUE("icao_code");