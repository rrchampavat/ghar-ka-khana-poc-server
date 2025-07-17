import "dotenv/config";
import type { Config } from "drizzle-kit";
import { DB_CONNECTION_STRING } from "./src/constants/envVars";

export default {
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  schemaFilter: ["ecommerce-schema"],
  driver: "pg",
  dialect: "postgresql",
  dbCredentials: {
    // host: DB_HOST,
    // port: DB_PORT,
    // user: DB_USER,
    // password: DB_PASSWORD,
    // database: DB_NAME,
    connectionString: DB_CONNECTION_STRING,
    ssl: false
  }
} satisfies Config;
