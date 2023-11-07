ALTER TABLE "ecommerce-schema"."user_roles" RENAME COLUMN "id" TO "role_id";--> statement-breakpoint
ALTER TABLE "ecommerce-schema"."user_roles" DROP CONSTRAINT "user_roles_id_roles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-schema"."user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "ecommerce-schema"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
