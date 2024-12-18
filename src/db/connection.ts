import { DB_CONNECTION_STRING } from "@constants/envVars";
import * as schema from "@db/schemas/userSchema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(DB_CONNECTION_STRING, {
  keep_alive: 1,
  connect_timeout: 5000
});

const db = drizzle(client, { schema });

export default db;
