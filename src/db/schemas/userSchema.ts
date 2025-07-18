import { roles } from "@db/schemas/roleSchema";
import mySchema from "@db/schemas/schema";
import { InferSelectModel, relations } from "drizzle-orm";
import {
  bigserial,
  integer,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const users = mySchema.table("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  first_name: varchar("first_name", { length: 15 }).notNull(),
  last_name: varchar("last_name", { length: 15 }).notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  contact_no: varchar("contact_no", { length: 20 }).notNull().unique(),
  user_image: text("user_image"),
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

export type USER = InferSelectModel<typeof users>;
