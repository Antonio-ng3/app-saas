CREATE TABLE "plushie_generations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"original_image_url" text NOT NULL,
	"plush_image_url" text NOT NULL,
	"style" text NOT NULL,
	"quality" text DEFAULT 'high' NOT NULL,
	"status" text DEFAULT 'processing' NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" integer DEFAULT 5 NOT NULL,
	"max_credits" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plushie_generations" ADD CONSTRAINT "plushie_generations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "plushie_generations_user_id_idx" ON "plushie_generations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "plushie_generations_created_at_idx" ON "plushie_generations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_credits_user_id_idx" ON "user_credits" USING btree ("user_id");