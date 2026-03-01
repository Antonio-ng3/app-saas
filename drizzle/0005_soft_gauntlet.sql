CREATE TABLE "generated_image" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"original_image_url" text NOT NULL,
	"generated_image_url" text NOT NULL,
	"style" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "generated_image" ADD CONSTRAINT "generated_image_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "generated_image_user_id_idx" ON "generated_image" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generated_image_created_at_idx" ON "generated_image" USING btree ("created_at");