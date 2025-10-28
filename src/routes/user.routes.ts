import {
  getUserById,
  getUsers,
  updateUser
} from "@controllers/user.controller";
import { Router, RequestHandler } from "express";

const router: Router = Router();

router.get("/users", getUsers as RequestHandler);
router.get("/users/:userID", getUserById as RequestHandler);
router.put("/users/:userID", updateUser as RequestHandler);
export default router;
