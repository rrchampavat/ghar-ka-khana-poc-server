import { bigserial, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import mySchema from "./schema";

export const permissionEnum = pgEnum("permission_enum", [
  "ADD_USER",
  "DELETE_USER",
  "UPDATE_USER"
]);

export const permissions = mySchema.table("permission_master", {
  id: bigserial("id", { mode: "number" }),
  permission_name: varchar("permission_name", { length: 15 }).notNull(),
  enum: permissionEnum("enum").notNull().primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});
