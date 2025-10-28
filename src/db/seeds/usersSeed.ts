/* eslint-disable no-console */
import { BCRYPT_SALT } from "@constants/envVars";
import db, { client } from "@db/connection";
import { users } from "@db/schemas/usersSchema";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { reset, seed } from "drizzle-seed";

const getRandomFutureDate = () => {
  const today = new Date();
  const daysAhead = Math.floor(Math.random() * 365) + 1; // 1 to 365 days
  today.setDate(today.getDate() + daysAhead);
  return today;
};

const getOneYearAgoDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
};

const getRandomUserIDs = (
  min: number,
  max: number,
  count: number
): number[] => {
  const set = new Set<number>();
  while (set.size < count) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    set.add(rand);
  }
  return Array.from(set);
};

const seedUsers = async () => {
  try {
    console.log("<===== RESETTING USERS TABLE =====>");
    await reset(db, { users });

    await db.execute(
      sql`TRUNCATE TABLE "ecommerce-schema".users RESTART IDENTITY CASCADE;`
    );

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
          created_at: f.date({
            maxDate: new Date(),
            minDate: getOneYearAgoDate()
          }),
          updated_at: f.default({ defaultValue: null }),
          deleted_at: f.default({ defaultValue: null })
        },
        count: 1000
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
        password: customPassword
      })
      .where(eq(users.id, 1));

    console.log("<===== UPDATING RANDOM DELETED_AT FIELDS =====>");

    const totalUsers = await db.$count(users);

    const randomUserIDs = getRandomUserIDs(2, totalUsers, 150); // Exclude user_id 1

    for (const id of randomUserIDs) {
      await db
        .update(users)
        .set({
          deleted_at: getRandomFutureDate()
        })
        .where(eq(users.id, id));
      console.log("Updated user: ", id);
    }

    await db.execute(sql`
    SELECT setval(
      pg_get_serial_sequence('"ecommerce-schema"."users"', 'id'),
      COALESCE(MAX(id), 1),
      true
    )
    FROM "ecommerce-schema"."users";
    `);

    console.log("<===== DELETED_AT FIELD UPDATED FOR 150 USERS =====>");
  } catch (error) {
    console.error("Error during seeding users:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

seedUsers();
