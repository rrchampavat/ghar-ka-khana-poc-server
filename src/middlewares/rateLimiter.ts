import {
  DEFAULT_LIMIT,
  DEFAULT_WINDOW_MS,
  defaultRateLimitHandler
} from "@constants/apiRateLimit";
import setRateLimit, { Options } from "express-rate-limit";

const createRateLimiter = (options: Partial<Options>) => {
  return setRateLimit(options);
};

export const loginAPIRateLimiter = createRateLimiter({
  windowMs: DEFAULT_WINDOW_MS,
  limit: DEFAULT_LIMIT,
  handler: defaultRateLimitHandler,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  legacyHeaders: true
});
