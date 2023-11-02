import db from "../db/connection";
import { users } from "../db/schemas/schema";

const getAllUsers = async () => {
  try {
    const allUsers = await db.select().from(users);

    return allUsers;
  } catch (error: any) {
    // handle exception
  }
};

export default getAllUsers;
