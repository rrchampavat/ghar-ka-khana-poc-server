import { bigserial, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { roles } from "./roleSchema";
import { InferSelectModel } from "drizzle-orm";
import mySchema from "@db/schemas/schema";

export const userRoles = mySchema.table("user_roles", {
  id: serial("id").primaryKey(),
  user_id: bigserial("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id),
  role_id: serial("role_id")
    .notNull()
    .references(() => roles.id),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export type UserRole = InferSelectModel<typeof userRoles>;
