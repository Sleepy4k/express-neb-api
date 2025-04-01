/* eslint-disable perfectionist/sort-objects */
export const rateLimitConfig = {
  limit: 100,
  windowMs: 15 * 60 * 1000,
  legacyHeaders: true,
  standardHeaders: "draft-8",
  message: "Too many requests, please try again later.",
};
