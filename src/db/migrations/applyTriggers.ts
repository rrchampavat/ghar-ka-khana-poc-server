/* eslint-disable no-console */
import { readFileSync } from "fs";
import { join } from "path";
import { client } from "../connection";

const runTriggerMigration = async () => {
  try {
    console.log("<===== APPLYING UPDATED_AT TRIGGERS =====>");

    const sqlPath = join(
      __dirname,
      "../../../drizzle/0003_add_updated_at_triggers.sql"
    );
    const sql = readFileSync(sqlPath, "utf-8");

    await client.unsafe(sql);

    console.log("<===== TRIGGERS APPLIED SUCCESSFULLY =====>");
  } catch (error) {
    console.error("Error applying triggers:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

runTriggerMigration();
