import { InferSelectModel } from "drizzle-orm";
import {
  bigserial,
  boolean,
  integer,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import mySchema from "./schema";

export const refreshTokens = mySchema.table("refresh_tokens", {
  id: serial("id").primaryKey(),
  user_id: bigserial("user_id", { mode: "number" }).notNull(),
  token_hash: text("token_hash").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }),
  is_revoked: boolean("is_revoked").default(false).notNull(),
  replaced_by: integer("replaced_by"),
  user_agent: text("user_agent"),
  ip: text("ip")
});

export type REFRESH_TOKEN = InferSelectModel<typeof refreshTokens>;
