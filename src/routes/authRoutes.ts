import validate from "@middlewares/schemaValidation.ts";
import registerSchema from "@validation-schemas/authSchemas/registerSchema.ts";
import { register } from "contollers/authController.ts";
import { Router } from "express";

const router: Router = Router();

router.post("/register", validate(registerSchema), register);

export default router;
