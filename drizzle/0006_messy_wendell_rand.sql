ALTER TABLE "ecommerce-schema"."users" RENAME COLUMN "user_id" TO "id";--> statement-breakpoint
ALTER TABLE "ecommerce-schema"."user_roles" DROP CONSTRAINT "user_roles_user_id_users_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-schema"."user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "ecommerce-schema"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
