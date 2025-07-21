/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { roles } from "@db/schemas/rolesSchema";
import { sql } from "drizzle-orm";
import { reset } from "drizzle-seed";

const seedRoles = async () => {
  try {
    console.log("<===== RESETTING ROLES TABLE =====>");
    await reset(db, { roles });
    await db.execute(
      sql`TRUNCATE TABLE "ecommerce-schema".roles RESTART IDENTITY CASCADE;`
    );

    console.log("<===== SEEDING ROLES =====>");
    const now = new Date();

    await db.insert(roles).values([
      { name: "Admin", created_at: now },
      { name: "Cook", created_at: now },
      { name: "Delivery", created_at: now },
      { name: "User", created_at: now }
    ]);

    console.log("<===== SEEDING ROLES COMPLETED =====>");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedRoles();
