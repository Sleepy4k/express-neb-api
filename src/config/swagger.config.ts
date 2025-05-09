import path from "node:path";
import { fileURLToPath } from "node:url";

import { appConfig } from "./app.config.js";

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(fileURLToPath(import.meta.url), "../../");

/* eslint-disable perfectionist/sort-objects */
export const swaggerConfig = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: `${appConfig.name} - API Documentation`,
      version: "1.0.0",
      description: "List of available API endpoints for Nach NEB",
      license: {
        name: "MIT",
        url: "https://nach-neb.my.id/licenses/LICENSE",
      },
      contact: {
        name: "NEB Support",
        url: null, // Change this on bootstrap/middleware.ts
        email: "admin@nach-neb.my.id",
      },
    },
    servers: [
      {
        prior: "development",
        url: "http://localhost:3000/api",
        description: "Local server",
      },
      {
        prior: "production",
        url: "https://nach-neb.my.id/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        TelegramApiAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Telegram-Token',
        },
      },
    },
    security: [
      {
        TelegramApiAuth: [],
      },
    ],
  },
  apis: [`${__basedir}/docs/**/*.yaml`],
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
