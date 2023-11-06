import dotenv from "dotenv";

dotenv.config();

export const SERVER_PORT = process.env.SERVER_PORT;

// DB CONNECTION
export const dbConnectionString = process.env.DB_CONNECTION_STRING!;
export const dbHost = process.env.DB_HOST!;
export const dbPort = Number(process.env.DB_PORT);
export const dbUser = process.env.DB_USER;
export const dbPassword = process.env.DB_PASSWORD;
export const dbName = process.env.DB_NAME!;
