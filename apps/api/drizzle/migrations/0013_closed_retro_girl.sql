ALTER TABLE "aircraft" ALTER COLUMN "short_name" SET DEFAULT '';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_index" ON "airport" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "city_index" ON "airport" ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "country_index" ON "airport" ("country");