import { InferModel } from "drizzle-orm";
import { pgSchema, serial, text, varchar } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("ecommerce-schema");

export const users = mySchema.table("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 })
});

export const tickets = mySchema.table("tickets", {
  id: serial("id").primaryKey()
});

export const products = mySchema.table("products", {
  id: serial("id").primaryKey()
});

export type User = InferModel<typeof users>;
export type Ticket = InferModel<typeof tickets>;
export type Product = InferModel<typeof products>;
