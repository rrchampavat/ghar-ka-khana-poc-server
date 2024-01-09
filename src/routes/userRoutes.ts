import { Router } from "express";
import getAllUsers from "../contollers/user.ts";

const router: Router = Router();

router.get("/", getAllUsers);

export default router;
