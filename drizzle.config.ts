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
    //   "postgresql://postgres:lojSlNlAMmDihwUb@db.hchkolhpoaiclscgfpkt.supabase.co:5432/postgres"
  }
} satisfies Config;
