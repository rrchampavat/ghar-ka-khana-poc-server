import { InferSelectModel, relations } from "drizzle-orm";
import { bigserial, timestamp } from "drizzle-orm/pg-core";
import { roles } from "./rolesSchema";
import mySchema from "./schema";
import { users } from "./usersSchema";

export const userRoles = mySchema.table("user_roles", {
  user_id: bigserial("user_id", { mode: "number" }).notNull(),
  role_id: bigserial("role_id", { mode: "number" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.user_id], references: [users.id] }),
  role: one(roles, { fields: [userRoles.role_id], references: [roles.id] })
}));

export type USER_ROLE = InferSelectModel<typeof userRoles>;
