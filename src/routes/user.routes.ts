import {
  activateUser,
  deactivateUser,
  getUserById,
  getUsers,
  updateUser
} from "@controllers/user.controller";
import { RequestHandler, Router } from "express";

const router: Router = Router();

router.get("/users", getUsers as RequestHandler);
router.get("/users/:userID", getUserById as RequestHandler);
router.put("/users/:userID", updateUser as RequestHandler);
router.patch("/users/:userID/deactivate", deactivateUser as RequestHandler);
router.patch("/users/:userID/activate", activateUser as RequestHandler);

export default router;
