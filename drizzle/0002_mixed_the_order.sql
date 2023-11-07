CREATE TABLE IF NOT EXISTS "ecommerce-schema"."roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_name" char(15) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ecommerce-schema"."users" ALTER COLUMN "updated_at" DROP NOT NULL;