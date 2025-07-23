/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import { sql } from "drizzle-orm";
import { reset } from "drizzle-seed";

const getRandomRoleId = () => {
  const rand = Math.random();
  if (rand < 0.25) return 2; // 25% chance
  if (rand < 0.5) return 3; // next 25%
  return 4; // remaining 50%
};

const seedUserRoles = async () => {
  try {
    console.log("<===== RESETTING USER_ROLES TABLE =====>");
    await reset(db, { userRoles });

    await db.execute(
      sql`TRUNCATE TABLE "ecommerce-schema".user_roles RESTART IDENTITY CASCADE;`
    );

    const userIDs = await db.select({ id: users.id }).from(users);

    const userRoleEntries = userIDs.map(({ id }) => {
      if (id === 1) return { user_id: 1, role_id: 1 };
      return { user_id: id, role_id: getRandomRoleId() };
    });

    console.log("<===== SEEDING USER_ROLES =====>");
    await db.insert(userRoles).values(userRoleEntries);
    console.log("<===== SEEDING USER_ROLES COMPLETED =====>");
  } catch (error) {
    console.error("Error during seeding user_roles:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedUserRoles();
