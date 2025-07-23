import { DB_CONNECTION_STRING } from "@constants/envVars";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { permissions, permissionsRelations } from "./schemas/permissionsSchema";
import {
  rolePermissions,
  rolePermissionsRelations
} from "./schemas/rolePermissionsSchema";
import { roles, rolesRelations } from "./schemas/rolesSchema";
import { userRoles, userRolesRelations } from "./schemas/userRolesSchema";
import { users, usersRelations } from "./schemas/usersSchema";

const client = postgres(DB_CONNECTION_STRING, {
  keep_alive: 1,
  connect_timeout: 5000
});

const schema = {
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,

  // Relations
  usersRelations,
  rolesRelations,
  permissionsRelations,
  userRolesRelations,
  rolePermissionsRelations
};

const db = drizzle(client, { schema });

export default db;
export { client };
