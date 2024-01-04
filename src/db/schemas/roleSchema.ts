import { InferSelectModel, relations } from "drizzle-orm";
import { char, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import mySchema from "@db/schemas/schema";

export const roles = mySchema.table("roles", {
  id: serial("id").primaryKey(),
  role_name: char("role_name", { length: 15 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users, { relationName: "roles" })
}));

export type User = InferSelectModel<typeof roles>;
