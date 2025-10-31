import db from "@db/connection";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import { applySorting } from "@helpers/applySorting";
import hasPermission, { isAdmin } from "@helpers/checkPermission";
import getPaginatedData from "@helpers/getPaginatedData";
import {
  badRequestRes,
  fetchSuccess,
  forbiddenRes,
  notFoundRes,
  updateSuccess
} from "@helpers/httpResponseGenerator";
import { and, eq } from "drizzle-orm";
import { NextFunction, Response } from "express";
import { CUSTOM_REQUEST } from "types/extended-types";

export const getUsers = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, query } = req;

    const { page = "1", limit = "10", sortBy = "", sortOrder = "" } = query;

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
        is_active: users.is_active
      })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, users.id))
      .innerJoin(roles, eq(roles.id, userRoles.role_id));
    // List deleted user at the end
    // .orderBy(desc(users.deleted_at));
    // .where(eq(users.is_active, true));

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
        updated_at: users.updated_at
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

export const updateUser = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, params, body } = req;
    const userId = params.userID!;

    const { firstName, lastName, email, userImage, contactNo, role } = body;

    if (userId === "undefined") {
      return badRequestRes(res, "Provide user id.");
    }

    const hasUserUpdatePermission = await hasPermission(user.id, "update:user");

    if (!(hasUserUpdatePermission || user.id === parseInt(userId))) {
      return forbiddenRes(
        res,
        "You do not have permission to update this user."
      );
    }

    const baseQuery = db.select().from(users);

    const userDetails = await baseQuery.where(eq(users.id, parseInt(userId)));

    if (!userDetails.length) {
      return notFoundRes(res, "User not found.");
    }

    const isUserActive =
      (
        await baseQuery.where(
          and(eq(users.id, parseInt(userId)), eq(users.is_active, true))
        )
      ).length > 0;

    if (!isUserActive) {
      return badRequestRes(res, "Deactivated user can not be updated.");
    }

    // Check if user has update permission
    // User should be able to fetch their own details

    await db
      .update(users)
      .set({
        first_name: firstName || userDetails[0]?.first_name,
        last_name: lastName || userDetails[0]?.last_name,
        contact_no: contactNo || userDetails[0]?.contact_no,
        email: email || userDetails[0]?.email,
        user_image: userImage || userDetails[0]?.user_image
      })
      .where(eq(users.id, parseInt(userId)));

    await db
      .update(userRoles)
      .set({
        role_id: role
      })
      .where(eq(userRoles.user_id, parseInt(userId)));

    return updateSuccess(res, "User updated successfully.");
  } catch (error: any) {
    return next(error);
  }
};

export const deactivateUser = async (
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

    // Check if the current user is an admin
    const isUserAdmin = await isAdmin(user.id);

    if (!isUserAdmin) {
      return forbiddenRes(res, "Only administrators can deactivate users.");
    }

    // Prevent admin from deactivating themselves
    if (user.id === parseInt(userId)) {
      return forbiddenRes(res, "You cannot deactivate your own account.");
    }

    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)));

    if (!userDetails.length || !userDetails[0]) {
      return notFoundRes(res, "User not found.");
    }

    const targetUser = userDetails[0];

    // Check if user is already deactivated
    if (!targetUser.is_active) {
      return badRequestRes(res, "User is already deactivated.");
    }

    await db
      .update(users)
      .set({
        is_active: false,
        updated_at: new Date()
      })
      .where(eq(users.id, parseInt(userId)));

    return updateSuccess(res, "User deactivated successfully.");
  } catch (error: any) {
    return next(error);
  }
};
