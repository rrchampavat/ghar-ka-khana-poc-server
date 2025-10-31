/* eslint-disable no-console */
import db, { client } from "@db/connection";
import { users } from "@db/schemas/usersSchema";
import { eq } from "drizzle-orm";

const testUpdatedAt = async () => {
  try {
    console.log("<===== TESTING UPDATED_AT TRIGGER =====>");

    // Get a user
    const user = await db.select().from(users).limit(1);

    if (!user.length) {
      console.log("No users found. Please seed the database first.");
      return;
    }

    const firstUser = user[0]!;
    const userId = firstUser.id;
    const oldUpdatedAt = firstUser.updated_at;

    console.log(`User ID: ${userId}`);
    console.log(`Old updated_at: ${oldUpdatedAt}`);

    // Wait a moment to ensure time difference
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the user
    await db
      .update(users)
      .set({
        first_name: firstUser.first_name // Set to same value, just to trigger update
      })
      .where(eq(users.id, userId));

    // Fetch the user again
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    const newUpdatedAt = updatedUser[0]?.updated_at;

    console.log(`New updated_at: ${newUpdatedAt}`);

    // Check if updated_at changed (not necessarily greater, as old data might have future dates)
    if (newUpdatedAt && oldUpdatedAt.toString() !== newUpdatedAt.toString()) {
      console.log("✅ SUCCESS: updated_at was automatically updated!");
      console.log(`   Changed from: ${oldUpdatedAt}`);
      console.log(`   Changed to: ${newUpdatedAt}`);
    } else {
      console.log("❌ FAILED: updated_at was not updated");
    }

    console.log("<===== TEST COMPLETED =====>");
  } catch (error) {
    console.error("Error testing trigger:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

testUpdatedAt();
