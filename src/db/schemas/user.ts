import { InferModel } from "drizzle-orm";
import {
  bigint,
  bigserial,
  char,
  pgSchema,
  pgTable,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("ecommerce-schema");

export const users = pgTable("users", {
  user_id: bigserial("user_id", { mode: "number" }).primaryKey(),
  first_name: char("first_name", { length: 15 }).notNull(),
  last_name: char("last_name", { length: 15 }).notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  contact_no: bigint("contact_no", { mode: "number" }).notNull().unique(),
  user_image: varchar("user_image"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull(),
  deleted_at: timestamp("deleted_at", { withTimezone: true })
});

export type User = InferModel<typeof users>;
