import { InferSelectModel, relations } from "drizzle-orm";
import { bigserial, timestamp } from "drizzle-orm/pg-core";
import { permissions } from "./permissionsSchema";
import { roles } from "./rolesSchema";
import mySchema from "./schema";

export const rolePermissions = mySchema.table("role_permissions", {
  role_id: bigserial("role_id", { mode: "number" }).notNull(),
  permission_id: bigserial("permission_id", { mode: "number" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.role_id],
      references: [roles.id]
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permission_id],
      references: [permissions.id]
    })
  })
);

export type ROLE_PERMISSION = InferSelectModel<typeof rolePermissions>;
