import validate from "@middlewares/schemaValidation.ts";
import registerSchema from "@validation-schemas/authSchemas/registerSchema.ts";
import { registerUser } from "contollers/authController.ts";
import { Router } from "express";

const router: Router = Router();

router.post("/register", validate(registerSchema), registerUser);

export default router;
