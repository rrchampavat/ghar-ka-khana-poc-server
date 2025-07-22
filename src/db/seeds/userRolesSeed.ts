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
      { user_id: 3, role_id: 2 },
      { user_id: 4, role_id: 3 },
      { user_id: 5, role_id: 2 },
      { user_id: 6, role_id: 2 },
      { user_id: 7, role_id: 2 },
      { user_id: 8, role_id: 2 },
      { user_id: 9, role_id: 3 },
      { user_id: 10, role_id: 3 },
      { user_id: 11, role_id: 2 },
      { user_id: 12, role_id: 2 },
      { user_id: 13, role_id: 2 },
      { user_id: 14, role_id: 3 },
      { user_id: 15, role_id: 2 },
      { user_id: 16, role_id: 3 },
      { user_id: 17, role_id: 2 },
      { user_id: 18, role_id: 2 },
      { user_id: 19, role_id: 2 },
      { user_id: 20, role_id: 3 }
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
