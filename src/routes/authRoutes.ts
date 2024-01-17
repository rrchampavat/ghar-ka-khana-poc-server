import { login } from "./../controllers/authController";
import { registerUser } from "@controllers/authController";
import { Router } from "express";
import validate from "@middlewares/schemaValidation";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";
import loginSchema from "@validation-schemas/authSchemas/loginSchema";
import { loginAPIRateLimiter } from "@middlewares/rateLimit";

const router: Router = Router();

router.post(
  "/register",
  loginAPIRateLimiter,
  validate(registerBodySchema),
  registerUser
);
router.post("/login", loginAPIRateLimiter, validate(loginSchema), login);

export default router;
