DO $$ BEGIN
 CREATE TYPE "airport_size" AS ENUM('small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "airport" ADD COLUMN "size" "airport_size";