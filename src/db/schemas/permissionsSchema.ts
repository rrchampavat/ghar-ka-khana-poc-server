import { InferSelectModel, relations } from "drizzle-orm";
import { bigserial, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { rolePermissions } from "./rolePermissionsSchema";
import mySchema from "./schema";

export const permissionEnum = pgEnum("permission_enum", [
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

export const permissions = mySchema.table("permissions", {
  id: bigserial("id", { mode: "number" }),
  permission_name: varchar("permission_name", { length: 50 }).notNull(),
  action: permissionEnum("action").notNull().primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions)
}));

export type PERMISSION = InferSelectModel<typeof permissions>;
