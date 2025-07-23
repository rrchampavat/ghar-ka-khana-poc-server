/* eslint-disable @typescript-eslint/naming-convention */
export const USER_ROLES = {
  ADMIN: 1,
  COOK: 2,
  DELIVERY: 3,
  Customer: 4,
  1: "Admin",
  2: "Cook",
  3: "Delivery",
  4: "Customer"
};

export const PERMISSIONS = {
  USER: {
    CREATE: "create:user",
    READ: "read:user",
    UPDATE: "update:user",
    DELETE: "delete:user"
  },
  ROLE: {
    CREATE: "create:role",
    READ: "read:role",
    UPDATE: "update:role",
    DELETE: "delete:role"
  },
  PERMISSION: {
    CREATE: "create:permission",
    READ: "read:permission",
    UPDATE: "update:permission",
    DELETE: "delete:permission"
  }
};
