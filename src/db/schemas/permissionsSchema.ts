import { InferSelectModel, relations } from "drizzle-orm";
import { bigserial, timestamp, varchar } from "drizzle-orm/pg-core";
import { rolePermissions } from "./rolePermissionsSchema";
import mySchema from "./schema";

// ✅ Enum inside gkk-schema
export const permissionEnum = mySchema.enum("permission_enum", [
  "create:user",
  "delete:user",
  "update:user",
  "read:user",
  "create:role",
  "delete:role",
  "update:role",
  "read:role",
  "create:permission",
  "delete:permission",
  "update:permission",
  "read:permission"
]);

// ✅ Bigserial fixes sequence issues
export const permissions = mySchema.table("permissions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  permission_name: varchar("permission_name", { length: 50 }).notNull(),
  action: permissionEnum("action").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  // Auto-updated via database trigger (see drizzle/0003_add_updated_at_triggers.sql)
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions)
}));

export type PERMISSION = InferSelectModel<typeof permissions>;
