CREATE SCHEMA "ecommerce-schema";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" bigserial PRIMARY KEY NOT NULL,
	"first_name" char(15) NOT NULL,
	"last_name" char(15) NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"contact_no" bigint NOT NULL,
	"user_image" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_contact_no_unique" UNIQUE("contact_no")
);
