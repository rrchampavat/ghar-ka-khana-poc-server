import dotenv from "dotenv";
import * as process from "process";

dotenv.config();

export const SERVER_PORT = Number(process.env.SERVER_PORT);
export const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

// DB CONNECTION
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_USER = process.env.DB_USER!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;
export const DB_NAME = process.env.DB_NAME!;

// UPLOAD THING

export const UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET!;
export const UPLOADTHING_APP_ID = process.env.UPLOADTHING_APP_ID!;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN_SEC = parseInt(process.env.JWT_EXPIRES_IN_SEC!, 10);
export const REFRESH_TOKEN_BYTES = parseInt(
  process.env.REFRESH_TOKEN_BYTES!,
  10
); // length of refresh token (random bytes)
export const REFRESH_TOKEN_EXP_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXP_DAYS!,
  10
); // refresh token validity
