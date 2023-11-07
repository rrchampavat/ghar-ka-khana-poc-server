CREATE TABLE IF NOT EXISTS "ecommerce-schema"."user_roles" (
	"user_role_id" serial PRIMARY KEY NOT NULL,
	"user_id" bigserial NOT NULL,
	"id" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ecommerce-schema"."users" DROP CONSTRAINT "users_role_id_roles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-schema"."user_roles" ADD CONSTRAINT "user_roles_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "ecommerce-schema"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-schema"."user_roles" ADD CONSTRAINT "user_roles_id_roles_id_fk" FOREIGN KEY ("id") REFERENCES "ecommerce-schema"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
