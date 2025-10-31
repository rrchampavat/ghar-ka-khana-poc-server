CREATE SCHEMA "gkk-schema";
--> statement-breakpoint
CREATE TYPE "gkk-schema"."permission_enum" AS ENUM('create:user', 'delete:user', 'update:user', 'read:user', 'create:role', 'delete:role', 'update:role', 'read:role', 'create:permission', 'delete:permission', 'update:permission', 'read:permission');--> statement-breakpoint
CREATE TABLE "gkk-schema"."permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"permission_name" varchar(50) NOT NULL,
	"action" "gkk-schema"."permission_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "gkk-schema"."role_permissions" (
	"role_id" bigint NOT NULL,
	"permission_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "gkk-schema"."roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(15) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "gkk-schema"."user_roles" (
	"user_id" bigint NOT NULL,
	"role_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "gkk-schema"."users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"first_name" varchar(15) NOT NULL,
	"last_name" varchar(15) NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"contact_no" varchar(20) NOT NULL,
	"user_image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_contact_no_unique" UNIQUE("contact_no")
);
