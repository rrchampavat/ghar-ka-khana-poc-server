import { JWT_SECRET } from "@constants/envVars";
import db from "@db/connection";
import { users } from "@db/schemas/userSchema";
import { notAuthorizedRes } from "@helpers/httpResponseGenerator";
// @ts-expect-error
import { CUSTOM_REQUEST } from "@types/extended-types";
import { and, eq, isNull } from "drizzle-orm";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const validateToken = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    const headerToken = authHeader && authHeader.split(" ")[1];

    if (!headerToken) {
      return notAuthorizedRes(res, "The request is not authorized.");
    }

    const decodedToken = jwt.verify(headerToken, JWT_SECRET) as JwtPayload;

    const { user_id } = decodedToken;

    const existingUser = await db.query.users.findFirst({
      where: and(eq(users.id, user_id), isNull(users.deleted_at)),
      columns: {
        password: false
      }
    });

    if (!existingUser) {
      return notAuthorizedRes(res, "The request is not authorized.");
    }

    req.user = existingUser;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default validateToken;
