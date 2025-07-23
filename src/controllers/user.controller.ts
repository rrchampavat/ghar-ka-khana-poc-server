import db from "@db/connection";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import { applySorting } from "@helpers/applySorting";
import hasPermission from "@helpers/checkPermission";
import getPaginatedData from "@helpers/getPaginatedData";
import {
  badRequestRes,
  fetchSuccess,
  forbiddenRes,
  notFoundRes
} from "@helpers/httpResponseGenerator";
import { eq, isNull } from "drizzle-orm";
import { NextFunction, Response } from "express";
import { CUSTOM_REQUEST } from "types/extended-types";

export const getUsers = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, query } = req;

    const {
      page = "1",
      limit = "10",
      sortBy = "created_at",
      sortOrder = "ascending"
    } = query;
    const hasUserReadPermission = await hasPermission(user.id, "read:user");

    // Check if the user has permission to view all users
    if (!hasUserReadPermission) {
      return forbiddenRes(res, "You do not have permission to view user list.");
    }

    const getUsersQuery = db
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
      .innerJoin(roles, eq(roles.id, userRoles.role_id))
      .where(isNull(users.deleted_at));

    const sortedQuery = applySorting(users, { sortBy, sortOrder })(
      getUsersQuery
    );

    const allUsers = await getPaginatedData<USER_WO_PASSWORD[]>(sortedQuery, {
      baseTable: users,
      page: parseInt(page),
      limit: parseInt(limit)
    });

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

    if (userId === "undefined") {
      return badRequestRes(res, "Provide user id.");
    }

    const hasUserReadPermission = await hasPermission(user.id, "read:user");

    // Check if user has read permission
    // User should be able to fetch their own details
    if (!(hasUserReadPermission || user.id === parseInt(userId))) {
      return forbiddenRes(res, "You do not have permission to view this user.");
    }

    const userDetails: USER_WO_PASSWORD[] = await db
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
