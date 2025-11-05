import {
  BCRYPT_SALT,
  JWT_EXPIRES_IN_SEC,
  JWT_SECRET,
  REFRESH_TOKEN_BYTES,
  REFRESH_TOKEN_EXP_DAYS
} from "@constants/envVars";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";

export const generateJwtToken = (
  payload: string | object | Buffer,
  expiresIn: number = JWT_EXPIRES_IN_SEC
) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return accessToken;
};

export const generateRefreshTokenString = () => {
  const buf = randomBytes(REFRESH_TOKEN_BYTES);

  return buf.toString("hex");
};

export const hashRefreshToken = (token: string) =>
  bcrypt.hash(token, BCRYPT_SALT);

export const compareRefreshTokenHash = (token: string, hash: string) =>
  bcrypt.compare(token, hash);

export const getRefreshExpiryDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + REFRESH_TOKEN_EXP_DAYS);

  return date;
};
