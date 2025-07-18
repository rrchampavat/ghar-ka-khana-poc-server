/* eslint-disable no-console */
// src/db/seed/index.ts
import { execSync } from "child_process";
import path from "path";

async function runSeedsInOrder() {
  const seedFiles = [
    "roleSeed.ts",
    "userSeed.ts"
    // Add more seed files in the order you want them to run
  ];

  for (const seedFile of seedFiles) {
    try {
      console.log(`\n🌱 Running ${seedFile}...`);

      const seedPath = path.join(__dirname, seedFile);
      execSync(`npx tsx ${seedPath}`, {
        stdio: "inherit",
        cwd: process.cwd()
      });

      console.log(`✅ ${seedFile} completed successfully`);
    } catch (error) {
      console.error(`❌ Error running ${seedFile}:`, error);
      process.exit(1);
    }
  }

  console.log("\n🎉 All seeds completed successfully!");
}

runSeedsInOrder();
