ALTER TABLE "oauth_session" ADD COLUMN "scope" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_session" ADD COLUMN "redirect_url" varchar(250) NOT NULL;