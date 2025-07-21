/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { rolePermissions } from "@db/schemas/rolePermissionsSchema";
import { reset } from "drizzle-seed";

const seedRolePermissions = async () => {
  try {
    console.log("<===== RESETTING ROLE_PERMISSIONS TABLE =====>");
    await reset(db, { rolePermissions });

    console.log("<===== SEEDING ROLE_PERMISSIONS =====>");

    await db.insert(rolePermissions).values([
      {
        role_id: 1,
        permission_id: 1,
        created_at: new Date()
      },
      {
        role_id: 1,
        permission_id: 2,
        created_at: new Date()
      },
      {
        role_id: 1,
        permission_id: 3,
        created_at: new Date()
      },
      {
        role_id: 1,
        permission_id: 4,
        created_at: new Date()
      },
      {
        role_id: 2,
        permission_id: 4,
        created_at: new Date()
      }
    ]);

    console.log("<===== SEEDING ROLE_PERMISSIONS COMPLETED =====>");
  } catch (error) {
    console.error("Error during seeding role_permissions:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedRolePermissions();
