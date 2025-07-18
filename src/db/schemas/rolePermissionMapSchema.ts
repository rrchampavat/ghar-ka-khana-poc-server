import { relations } from "drizzle-orm";
import { bigserial, timestamp } from "drizzle-orm/pg-core";
import { permissions } from "./permissionSchema";
import { roles } from "./roleSchema";
import mySchema from "./schema";

export const rolePermissionMap = mySchema.table("role_permission_map", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  role_id: bigserial("role_id", { mode: "number" }).notNull(),
  permission_id: bigserial("permission_id", { mode: "number" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull(),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const rolePermissionMapRelations = relations(
  rolePermissionMap,
  ({ one }) => ({
    role_id: one(roles, {
      fields: [rolePermissionMap.role_id],
      references: [roles.id],
      relationName: "role"
    }),
    permission_id: one(permissions, {
      fields: [rolePermissionMap.permission_id],
      references: [permissions.id],
      relationName: "permission"
    })
  })
);
