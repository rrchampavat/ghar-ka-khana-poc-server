import { bigint, timestamp } from "drizzle-orm/pg-core";
import mySchema from "./schema";

export const userRoles = mySchema.table("user_roles", {
  user_id: bigint("user_id", { mode: "number" }).notNull(),
  role_id: bigint("role_id", { mode: "number" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  // Auto-updated via database trigger (see drizzle/0003_add_updated_at_triggers.sql)
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});
