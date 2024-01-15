import { JWT_SECRET } from "@constants/envVars";
import { JWT_EXPIRES_IN } from "@constants/jwt";
import jwt from "jsonwebtoken";

const generateJwtToken = (
  payload: string | object | Buffer,
  expiresIn: number = JWT_EXPIRES_IN
) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return accessToken;
};

export default generateJwtToken;
