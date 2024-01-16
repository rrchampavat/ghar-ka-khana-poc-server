import { login } from "./../controllers/authController";
import { registerUser } from "@controllers/authController";
import { Router } from "express";
import validate from "@middlewares/schemaValidation";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";
import loginSchema from "@validation-schemas/authSchemas/loginSchema";

const router: Router = Router();

router.post("/register", validate(registerBodySchema), registerUser);
router.post("/login", validate(loginSchema), login);

export default router;
