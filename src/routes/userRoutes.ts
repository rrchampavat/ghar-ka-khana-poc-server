import getAllUsers from "@controllers/user";
import { Router } from "express";

const router: Router = Router();

router.get("/", getAllUsers);

export default router;
