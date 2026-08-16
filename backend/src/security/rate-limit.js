import rateLimit from "express-rate-limit";

export const visionRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many vision requests. Please try again later."
  }
});
