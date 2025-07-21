import mySchema from "@db/schemas/schema";
import { InferSelectModel, relations } from "drizzle-orm";
import { serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { rolePermissions } from "./rolePermissionsSchema";
import { userRoles } from "./userRolesSchema";

export const roles = mySchema.table("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 15 }).notNull().unique(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions)
}));

export type USER_ROLE = InferSelectModel<typeof roles>;
