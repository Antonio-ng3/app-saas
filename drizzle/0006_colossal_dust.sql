ALTER TABLE "generated_image" ALTER COLUMN "original_image_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "generated_image" ALTER COLUMN "generated_image_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "generated_image" ADD COLUMN "inngest_run_id" text;--> statement-breakpoint
ALTER TABLE "generated_image" ADD COLUMN "status" text DEFAULT 'complete' NOT NULL;--> statement-breakpoint
ALTER TABLE "generated_image" ADD COLUMN "error_message" text;--> statement-breakpoint
CREATE INDEX "generated_image_inngest_run_id_idx" ON "generated_image" USING btree ("inngest_run_id");