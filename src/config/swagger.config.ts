import { appConfig } from "./app.config.js";

/* eslint-disable perfectionist/sort-objects */
export const swaggerConfig = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: `${appConfig.name} - API Documentation`,
      version: "1.0.0",
      description: "List of available API endpoints for Nach NEB",
    },
    servers: [
      {
        prior: "development",
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        prior: "production",
        url: "https://nach-neb.my.id",
        description: "Production server",
      },
    ],
  },
};

export const swaggerUiConfig = {
  explorer: false,
  customSiteTitle: `${appConfig.name} - API Documentation`,
  swaggerOptions: {
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    supportedSubmitMethods: ["get", "head"],
    persistAuthorization: true,
  },
};
