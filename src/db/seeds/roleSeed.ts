/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { roles } from "@db/schemas/roleSchema";
import { reset, seed } from "drizzle-seed";

const seedRoles = async () => {
  try {
    console.log("<===== SEEDING ROLES =====>");

    await reset(db, { roles });

    await seed(db, {
      roles: roles
    }).refine((f) => ({
      roles: {
        columns: {
          role_name: f.valuesFromArray({
            values: ["Admin", "User", "Delivery", "Cook"],
            isUnique: true
          }),
          created_at: f.default({ defaultValue: new Date() }),
          updated_at: f.default({ defaultValue: null }),
          deleted_at: f.default({ defaultValue: null })
        },
        count: 4
      }
    }));

    console.log("<===== SEEDING ROLES COMPLETED =====>");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedRoles();
