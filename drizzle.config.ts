import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER
} from "./src/constants/envVars";
import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  schemaFilter: ["ecommerce-schema"],
  driver: "pg",
  dbCredentials: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
    // connectionString:
    //   dbConnectionString
  }
} satisfies Config;
