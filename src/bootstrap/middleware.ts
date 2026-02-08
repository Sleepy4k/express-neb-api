import { cspConfig, rateLimitConfig } from "@config";
import { swaggerConfig, swaggerUiConfig } from "@config/swagger.config.js";
import cors from "cors";
import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import logger from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default (app: Express, isDevMode: boolean): void => {
  /**
   * Set the application powered by header
   */
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Powered-By", "Naka Framework");
    res.setHeader(
      "Permission-Policy",
      "accelerometer=(self), attribution-reporting=*, autoplay=(), bluetooth=(), browsing-topics=*, camera=(), compute-pressure=(self), cross-origin-isolated=(self), display-capture=(self), encrypted-media=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), identity-credentials-get=(self), idle-detection=(self), local-fonts=(self), magnetometer=(self), microphone=(), midi=(self), otp-credentials=(), payment=(), picture-in-picture=*, publickey-credentials-create=(self), publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), storage-access=*, usb=(), web-share=(self), window-management=(self), vibrate=(), xr-spatial-tracking=(self)",
    );
    res.setHeader("Access-Control-Allow-Origin", isDevMode ? "*" : "neb.benjamin4k.web.id");
    next();
  });

  /**
   * Setup default express middlewares
   */
  app.use(express.json({ strict: true }));
  app.use(express.urlencoded({ extended: true, parameterLimit: 4 }));

  /**
   * Setup logger
   */
  if (isDevMode) app.use(logger("dev"));

  /**
   * Setup CORS
   */
  app.use(
    cors({
      allowedHeaders: ["Accept", "Authorization", "Content-Type", "Origin", "X-Requested-With", "X-Web-Token", "Access-Control-Allow-Origin"],
      credentials: true,
      exposedHeaders: ["Accept", "Authorization", "Content-Type", "Origin", "X-Requested-With", "X-Web-Token", "Access-Control-Allow-Origin"],
      maxAge: 86400,
      methods: "GET, POST, DELETE",
      optionsSuccessStatus: 200,
      origin: isDevMode ? "*" : (app.get("baseUrl") as string),
      preflightContinue: false,
    }),
  );

  /**
   * Rate limiter
   */
  if (!isDevMode) app.use(rateLimit(rateLimitConfig));

  /**
   * Content Security Policy
   */
  const createCspConfig = (additionalDirectives: Record<string, string[]>) => ({
    directives: {
      ...cspConfig.directives,
      ...additionalDirectives,
    },
  });

  const cspConfigWithNonce = createCspConfig({
    scriptSrc: ["'self'", "'strict-dynamic'"],
    styleSrc: ["'self'", "'strict-dynamic'"],
  });

  const cspConfigForDocs = createCspConfig({
    imgSrc: ["'self'", "data:", "http:", "https:"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  });

  /**
   * Setup security headers
   */
  app.use((req, res, next) => {
    const isApiDocs = req.path.includes("/docs");
    const selectedCspConfig = isApiDocs ? cspConfigForDocs : cspConfigWithNonce;

    helmet({
      contentSecurityPolicy: selectedCspConfig,
      crossOriginEmbedderPolicy: { policy: "require-corp" },
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-site" },
      originAgentCluster: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      strictTransportSecurity: {
        includeSubDomains: true,
        maxAge: 31536000,
        preload: true,
      },
      xContentTypeOptions: true,
      xDnsPrefetchControl: { allow: true },
      xDownloadOptions: true,
      xFrameOptions: { action: "deny" },
      xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
      xPoweredBy: false,
      xXssProtection: true,
    })(req, res, next);
  });

  /**
   * Enable Http Strict Transport Security (HSTS)
   */
  if (!isDevMode) app.set("trust proxy", 1);

  if (isDevMode) {
    /**
     * Setup swagger documentation
     */
    const mergedSwaggerConfig = {
      ...swaggerConfig,
      apis: [`${app.get("basePath") as string}/docs/**/*.yaml`],
      definition: {
        ...swaggerConfig.definition,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        servers: swaggerConfig.definition.servers.sort((a, _b) => (a.prior === "development" ? -1 : 1)),
      },
    };

    const mergedSwaggerUiConfig = {
      ...swaggerUiConfig,
      customfavIcon: new URL("/favicon.ico", app.get("baseUrl") as string).toString(),
    };

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(mergedSwaggerConfig), mergedSwaggerUiConfig));
  }
};
