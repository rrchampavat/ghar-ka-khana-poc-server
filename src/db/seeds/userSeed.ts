/* eslint-disable no-console */
import { BCRYPT_SALT } from "@constants/envVars";
import db, { client } from "@db/connection";
import { users } from "@db/schemas/userSchema";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { reset, seed } from "drizzle-seed";

const seedUsers = async () => {
  try {
    console.log("<===== RESETTING USERS TABLE =====>");
    await reset(db, { users });

    const defaultPassword = "User@1234";
    const hashedPassword = await bcrypt.hash(defaultPassword, BCRYPT_SALT);

    console.log("<===== SEEDING USERS =====>");
    await seed(db, {
      users
    }).refine((f) => ({
      users: {
        columns: {
          first_name: f.firstName(),
          last_name: f.lastName(),
          password: f.default({
            defaultValue: hashedPassword
          }),
          email: f.email(),
          contact_no: f.phoneNumber(),
          user_image: f.default({ defaultValue: null }),
          role: f.valuesFromArray({
            values: [2, 3, 4]
          }),
          created_at: f.default({ defaultValue: new Date() }),
          updated_at: f.default({ defaultValue: null }),
          deleted_at: f.default({ defaultValue: null })
        },
        count: 10
      }
    }));

    console.log("<===== SEEDING USERS COMPLETED =====>");

    console.log("<===== UPDATING ADMIN USER =====>");

    const customPassword = await bcrypt.hash(
      "NoPasswordNeeded1110@",
      BCRYPT_SALT
    );

    await db
      .update(users)
      .set({
        first_name: "Rutvikraj",
        last_name: "Champavat",
        email: "rrchampavat1110@gmail.com",
        contact_no: "8000012801",
        password: customPassword,
        role: 1
      })
      .where(eq(users.id, 1));

    await db.execute(sql`
  SELECT setval(
    pg_get_serial_sequence('"ecommerce-schema"."users"', 'id'),
    COALESCE(MAX(id), 1),
    true
  )
  FROM "ecommerce-schema"."users";
`);
  } catch (error) {
    console.error("Error during seeding users:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedUsers();
