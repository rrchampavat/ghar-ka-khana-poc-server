import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@db/schemas/userSchema";
import { DB_CONNECTION_STRING } from "@constants/envVars";

const client = postgres(DB_CONNECTION_STRING);

const db = drizzle(client, { schema });

export default db;
