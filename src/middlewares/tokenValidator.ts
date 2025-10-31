import { JWT_SECRET } from "@constants/envVars";
import db from "@db/connection";
import { users } from "@db/schemas/usersSchema";
import { notAuthorizedRes } from "@helpers/httpResponseGenerator";
import { eq } from "drizzle-orm";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CUSTOM_REQUEST } from "types/extended-types";

const validateToken = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
  try {
    const authHeader = req.headers["authorization"];

    const headerToken = authHeader && authHeader.split(" ")[1];

    if (!headerToken) {
      return notAuthorizedRes(res, "The request is not authorized.");
    }

    const decodedToken = jwt.verify(headerToken, JWT_SECRET) as JwtPayload;

    const { user_id } = decodedToken;

    // First check if user exists at all
    const user = await db.query.users.findFirst({
      where: eq(users.id, user_id),
      columns: {
        password: false
      }
    });

    if (!user) {
      return notAuthorizedRes(
        res,
        "Account no longer exists. Please contact support if this is unexpected."
      );
    }

    // Check if user account is deactivated
    if (!user.is_active) {
      return notAuthorizedRes(
        res,
        "Your account has been deactivated. Please contact support to restore access."
      );
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default validateToken;
