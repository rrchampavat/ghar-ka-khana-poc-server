import mySchema from "@db/schemas/schema";
import { InferSelectModel, relations } from "drizzle-orm";
import {
  bigserial,
  boolean,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { userRoles } from "./userRolesSchema";

export const users = mySchema.table("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  first_name: varchar("first_name", { length: 15 }).notNull(),
  last_name: varchar("last_name", { length: 15 }).notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  contact_no: varchar("contact_no", { length: 20 }).notNull().unique(),
  is_active: boolean("is_active").default(true).notNull(),
  user_image: text("user_image"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
  // Auto-updated via database trigger (see drizzle/0003_add_updated_at_triggers.sql)
});

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles)
}));

export type USER = InferSelectModel<typeof users>;
