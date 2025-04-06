/* eslint-disable perfectionist/sort-objects */
export const cspConfig = {
  directives: {
    defaultSrc: ["'none'"],
    baseUri: ["'none'"],
    manifestSrc: ["'self'"],
    formAction: ["'self'"],
    imgSrc: ["'self'", "data:"],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    fontSrc: ["'self'"],
    frameSrc: ["'self'"],
    blockAllMixedContent: [],
    connectSrc: ["'self'"],
    scriptSrc: ["'self'", "'strict-dynamic'"],
    styleSrc: ["'self'", "'strict-dynamic'"],
    upgradeInsecureRequests: [],
  },
};
