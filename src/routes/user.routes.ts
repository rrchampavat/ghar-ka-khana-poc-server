import { getAllUsers, getUserById } from "@controllers/user.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/users", getAllUsers);
router.get("/users/:userID", getUserById);

export default router;
