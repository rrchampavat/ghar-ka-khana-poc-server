ALTER TABLE "ecommerce-schema"."users" ADD COLUMN "role_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-schema"."users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "ecommerce-schema"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
