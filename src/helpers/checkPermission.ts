import db from "@db/connection";
import { permissions } from "@db/schemas/permissionsSchema";
import { rolePermissions } from "@db/schemas/rolePermissionsSchema";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import { and, eq, SQLWrapper } from "drizzle-orm";

const hasPermission = async (
  userId: number,
  action:
    | SQLWrapper
    | "create:user"
    | "delete:user"
    | "update:user"
    | "read:user"
    | "create:role"
    | "delete:role"
    | "update:role"
    | "read:role"
    | "create:permission"
    | "delete:permission"
    | "update:permission"
    | "read:permission"
): Promise<boolean> => {
  const userRole = await db
    .select({ action: permissions.action })
    .from(users)
    .rightJoin(userRoles, eq(users.id, userRoles.user_id))
    .rightJoin(rolePermissions, eq(userRoles.role_id, rolePermissions.role_id))
    .rightJoin(permissions, eq(rolePermissions.permission_id, permissions.id))
    .where(and(eq(permissions.action, action), eq(users.id, userId)));

  return userRole.length > 0;
};

export const isAdmin = async (userId: number): Promise<boolean> => {
  const userRole = await db
    .select({ roleName: roles.name })
    .from(users)
    .innerJoin(userRoles, eq(users.id, userRoles.user_id))
    .innerJoin(roles, eq(userRoles.role_id, roles.id))
    .where(and(eq(users.id, userId), eq(roles.name, "Admin")));

  return userRole.length > 0;
};

export default hasPermission;
