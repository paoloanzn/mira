ALTER TABLE "users" ADD COLUMN "is_agent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hostname" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "is_agent_idx" ON "users" USING btree ("is_agent") WHERE "users"."is_agent" = true;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_hostname_unique" UNIQUE("hostname");