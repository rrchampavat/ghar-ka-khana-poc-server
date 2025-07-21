/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { userRoles } from "@db/schemas/userRolesSchema";
import { sql } from "drizzle-orm";
import { reset } from "drizzle-seed";

const seedUserRoles = async () => {
  try {
    console.log("<===== RESETTING USER_ROLES TABLE =====>");
    await reset(db, { userRoles });

    await db.execute(
      sql`TRUNCATE TABLE "ecommerce-schema".user_roles RESTART IDENTITY CASCADE;`
    );

    console.log("<===== SEEDING USER_ROLES =====>");

    await db.insert(userRoles).values([
      { user_id: 1, role_id: 1 },
      { user_id: 2, role_id: 2 },
      { user_id: 3, role_id: 3 }
    ]);

    console.log("<===== SEEDING USER_ROLES COMPLETED =====>");
  } catch (error) {
    console.error("Error during seeding user_roles:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedUserRoles();
