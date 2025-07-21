/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { permissions } from "@db/schemas/permissionsSchema";
import { reset } from "drizzle-seed";

const seedPermissions = async () => {
  try {
    console.log("<===== RESETTING PERMISSIONS TABLE =====>");
    await reset(db, { permissions });

    console.log("<===== SEEDING PERMISSIONS =====>");

    const now = new Date();

    await db.insert(permissions).values([
      {
        permission_name: "Create User",
        action: "create:user",
        created_at: now
      },
      {
        permission_name: "Delete User",
        action: "delete:user",
        created_at: now
      },
      {
        permission_name: "Update User",
        action: "update:user",
        created_at: now
      },
      { permission_name: "Read User", action: "read:user", created_at: now },

      {
        permission_name: "Create Role",
        action: "create:role",
        created_at: now
      },
      {
        permission_name: "Delete Role",
        action: "delete:role",
        created_at: now
      },
      {
        permission_name: "Update Role",
        action: "update:role",
        created_at: now
      },
      { permission_name: "Read Role", action: "read:role", created_at: now },

      {
        permission_name: "Create Permission",
        action: "create:permission",
        created_at: now
      },
      {
        permission_name: "Delete Permission",
        action: "delete:permission",
        created_at: now
      },
      {
        permission_name: "Update Permission",
        action: "update:permission",
        created_at: now
      },
      {
        permission_name: "Read Permission",
        action: "read:permission",
        created_at: now
      }
    ]);
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedPermissions();
