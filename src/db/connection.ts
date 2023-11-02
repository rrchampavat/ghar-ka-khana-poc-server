import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas/schema";

const connectionString = process.env.DB_CONNECTION_STRING as string;

const client = postgres(connectionString);

const db = drizzle(client, { schema });

export default db;
