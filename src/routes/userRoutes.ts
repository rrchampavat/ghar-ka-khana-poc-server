import getAllUsers from "contollers/user.ts";
import { Router } from "express";

const router: Router = Router();

router.get("/", getAllUsers);

export default router;
