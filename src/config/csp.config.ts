export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
    scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
    fontSrc: ["'self'"],
    imgSrc: ["*", "data:"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
};
