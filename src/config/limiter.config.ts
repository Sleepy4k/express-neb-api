export const rateLimitConfig = {
  legacyHeaders: true,
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
  standardHeaders: "draft-8",
  windowMs: 15 * 60 * 1000,
  // skip: (req: Request) => req.url === '/'
};
