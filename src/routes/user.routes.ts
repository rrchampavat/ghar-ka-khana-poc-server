import {
  getUserById,
  getUsers,
  updateUser
} from "@controllers/user.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/users", getUsers);
router.get("/users/:userID", getUserById);
router.put("/users/:userID", updateUser);

export default router;
