import { getUserById, getUsers } from "@controllers/user.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/users", getUsers);
router.get("/users/:userID", getUserById);

export default router;
