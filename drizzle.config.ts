import "dotenv/config";
import type { Config } from "drizzle-kit";
import { DB_CONNECTION_STRING } from "./src/constants/envVars";

export default {
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  schemaFilter: ["gkk-schema"],
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    // host: DB_HOST,
    // port: DB_PORT,
    // user: DB_USER,
    // password: DB_PASSWORD,
    // database: DB_NAME,
    url: DB_CONNECTION_STRING,
    ssl: false
  }
} satisfies Config;
