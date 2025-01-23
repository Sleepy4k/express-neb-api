export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after an hour',
  standardHeaders: 'draft-8',
  legacyHeaders: true,
  // skip: (req: Request) => req.url === '/'
};
