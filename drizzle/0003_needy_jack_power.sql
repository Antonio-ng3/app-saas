DROP TABLE "plushie_generations" CASCADE;--> statement-breakpoint
DROP TABLE "user_credits" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "credits" integer DEFAULT 5 NOT NULL;