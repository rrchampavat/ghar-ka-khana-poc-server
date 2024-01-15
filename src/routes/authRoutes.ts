import { registerUser } from "@controllers/authController";
import { Router } from "express";
import validate from "@middlewares/schemaValidation";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";

const router: Router = Router();

router.post("/register", validate(registerBodySchema), registerUser);

export default router;
