import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schemas/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME!
    // connectionString:
    //   process.env.DB_CONNECTION_STRING
  }
} satisfies Config;
