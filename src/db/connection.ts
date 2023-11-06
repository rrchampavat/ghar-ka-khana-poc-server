import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import * as schema from "./schemas/user";

const connectionString = process.env.DB_CONNECTION_STRING as string;

const client = postgres(connectionString);

const db = drizzle(client);

export default db;
