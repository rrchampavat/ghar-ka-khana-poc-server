import { InferSelectModel, relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  integer,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import mySchema from "@db/schemas/schema";
import { roles } from "@db/schemas/roleSchema.ts";

export const users = mySchema.table("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  contact_no: bigint("contact_no", { mode: "number" }).notNull().unique(),
  user_image: varchar("user_image"),
  role: integer("role_id").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export const userRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.role],
    references: [roles.id],
    relationName: "roles"
  })
}));

export type User = InferSelectModel<typeof users>;
