export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'"],
    imgSrc: ["*", "data:"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
    upgradeInsecureRequests: [],
  },
};
