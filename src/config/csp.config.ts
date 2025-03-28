/* eslint-disable perfectionist/sort-objects */
export const cspConfig = {
  directives: {
    baseUri: ["'self'"],
    defaultSrc: ["'self'"],
    formAction: ["'self'"],
    imgSrc: ["*", "data:"],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    fontSrc: ["'self'"],
    frameSrc: ["'self'"],
    blockAllMixedContent: [],
    connectSrc: ["'self'"],
    scriptSrc: ["'self'", "'strict-dynamic'"],
    styleSrc: ["'self'", "'strict-dynamic'", "'unsafe-inline'"],
    upgradeInsecureRequests: [],
  },
};
