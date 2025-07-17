import { registerUser } from "@controllers/authController";
import { loginAPIRateLimiter } from "@middlewares/rateLimit";
import validate from "@middlewares/schemaValidation";
import loginSchema from "@validation-schemas/authSchemas/loginSchema";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";
import { Router } from "express";
import { login } from "./../controllers/authController";

const router: Router = Router();

router.post(
  "/register",
  loginAPIRateLimiter,
  validate(registerBodySchema),
  registerUser
);
router.post("/login", loginAPIRateLimiter, validate(loginSchema), login);

export default router;
