import db from "@db/connection";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import hasPermission from "@helpers/checkPermission";
import {
  fetchSuccess,
  forbiddenRes,
  notFoundRes
} from "@helpers/httpResponseGenerator";
import { CUSTOM_REQUEST } from "@types/extended-types";
import { eq } from "drizzle-orm";
import { NextFunction, Response } from "express";

export const getAllUsers = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    const hasUserReadPermission = await hasPermission(user.id, "read:user");

    // Check if the user has permission to view all users
    if (hasUserReadPermission) {
      return forbiddenRes(res, "You do not have permission to view user list.");
    }

    const allUsers: USER[] = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        contact_no: users.contact_no,
        role: roles.id,
        user_image: users.user_image,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at
      })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, users.id))
      .innerJoin(roles, eq(roles.id, userRoles.role_id));

    return fetchSuccess(res, "Users fetched successfully.", allUsers);
  } catch (error: any) {
    return next(error);
  }
};

export const getUserById = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, params } = req;
    const userId = params.userID!;

    const hasUserReadPermission = await hasPermission(user.id, "read:user");

    // Check if user has read permission
    // User should be able to fetch their own details
    if (!(hasUserReadPermission || user.id === parseInt(userId))) {
      return forbiddenRes(res, "You do not have permission to view this user.");
    }

    const userDetails: USER[] = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        contact_no: users.contact_no,
        role: roles.id,
        user_image: users.user_image,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at
      })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, parseInt(userId)))
      .innerJoin(roles, eq(roles.id, userRoles.role_id))
      .where(eq(users.id, parseInt(userId)));

    if (!userDetails.length) {
      return notFoundRes(res, "User not found.");
    }

    return fetchSuccess(
      res,
      "User details fetched successfully.",
      userDetails[0]
    );
  } catch (error: any) {
    return next(error);
  }
};
