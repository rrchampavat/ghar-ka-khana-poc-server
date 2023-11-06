import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@db/schemas/user";
import { dbConnectionString } from "@constants/envVars";

const client = postgres(dbConnectionString);

const db = drizzle(client, { schema });

export default db;
