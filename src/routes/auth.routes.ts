import {
  generateRefreshToken,
  logout,
  registerUser
} from "@controllers/auth.controller";
import { loginAPIRateLimiter } from "@middlewares/rateLimiter";
import validate from "@middlewares/schemaValidator";
import loginSchema from "@validation-schemas/authSchemas/loginSchema";
import registerBodySchema from "@validation-schemas/authSchemas/registerSchema";
import { RequestHandler, Router } from "express";
import { login } from "../controllers/auth.controller";

const router: Router = Router();

router.post(
  "/register",
  loginAPIRateLimiter,
  validate(registerBodySchema),
  registerUser
);
router.post("/login", loginAPIRateLimiter, validate(loginSchema), login);
router.post(
  "/refresh",
  loginAPIRateLimiter,
  generateRefreshToken as RequestHandler
);
router.post("/logout", loginAPIRateLimiter, logout as RequestHandler);

export default router;
