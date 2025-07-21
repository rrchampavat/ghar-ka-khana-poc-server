import { registerUser } from "@controllers/auth.controller";
import { loginAPIRateLimiter } from "@middlewares/rateLimiter";
import validate from "@middlewares/schemaValidator";
import loginSchema from "@validation-schemas/authSchemas/loginSchema";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";
import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router: Router = Router();

router.post(
  "/register",
  loginAPIRateLimiter,
  validate(registerBodySchema),
  registerUser
);
router.post("/login", loginAPIRateLimiter, validate(loginSchema), login);

export default router;
