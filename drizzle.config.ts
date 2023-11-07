import {
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbUser
} from "./src/constants/envVars";
import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  schemaFilter: ["ecommerce-schema"],
  driver: "pg",
  dbCredentials: {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName
    // connectionString:
    //   dbConnectionString
  }
} satisfies Config;
