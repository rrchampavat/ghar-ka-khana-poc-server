import getAllUsers from "@controllers/user.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/", getAllUsers);

export default router;
