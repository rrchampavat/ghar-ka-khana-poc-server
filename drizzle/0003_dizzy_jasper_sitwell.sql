ALTER TABLE "gkk-schema"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_token_unique";--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ALTER COLUMN "user_id" SET DATA TYPE bigserial;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ADD COLUMN "token_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ADD COLUMN "replaced_by" integer;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" ADD COLUMN "ip" text;--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "gkk-schema"."refresh_tokens" DROP COLUMN "updated_at";