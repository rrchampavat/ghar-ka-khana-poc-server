/* eslint-disable no-console */
import { client } from "../connection";

const checkTriggers = async () => {
  try {
    console.log("<===== CHECKING IF TRIGGERS EXIST =====>");

    const result = await client.unsafe(`
      SELECT 
        trigger_schema,
        trigger_name,
        event_object_table,
        action_statement
      FROM information_schema.triggers
      WHERE trigger_schema = 'gkk-schema'
      ORDER BY event_object_table, trigger_name;
    `);

    if (result.length === 0) {
      console.log("❌ NO TRIGGERS FOUND in gkk-schema");
      console.log("Run: pnpm db:triggers to create them");
    } else {
      console.log(`✅ Found ${result.length} trigger(s):`);
      result.forEach((trigger: any) => {
        console.log(
          `  - ${trigger.trigger_name} on ${trigger.event_object_table}`
        );
      });
    }

    console.log("<===== CHECK COMPLETED =====>");
  } catch (error) {
    console.error("Error checking triggers:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

checkTriggers();
