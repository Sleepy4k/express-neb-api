/* eslint-disable perfectionist/sort-objects */
import { assetConfig, cspConfig, minifyConfig, rateLimitConfig, sessionConfig } from "@config";
import cors from "cors";
import express, { type Express } from "express";
import minifyHTML from "express-minify-html-2";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import logger from "morgan";
import path from "node:path";

export default (app: Express, dirname: string, isDevMode: boolean, cspNonce: string): void => {
  /**
   * Set the application powered by header
   */
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Powered-By", "Naka Framework");
    next();
  });

  /**
   * Minify the response
   */
  app.use(minifyHTML(minifyConfig));

  /**
   * Setup default express middlewares
   */
  app.use(express.json({ strict: true }));
  app.use(express.urlencoded({ extended: false, parameterLimit: 4 }));
  app.use(express.static(path.join(dirname, "public"), assetConfig));

  /**
   * Setup logger
   */
  app.use(logger(isDevMode ? "dev" : "tiny"));

  /**
   * Setup CORS
   */
  app.use(
    cors({
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      credentials: true,
      exposedHeaders: ["Content-Type", "Authorization", "Accept"],
      maxAge: 86400,
      methods: "GET, POST, DELETE",
      optionsSuccessStatus: 200,
      origin: isDevMode ? "*" : (app.get("host") as string),
      preflightContinue: false,
    }),
  );

  /**
   * Rate limiter
   */
  app.use(rateLimit(rateLimitConfig));

  /**
   * Content Security Policy
   */
  const cspConfigWithNonce = {
    directives: {
      ...cspConfig.directives,
      scriptSrc: [...cspConfig.directives.scriptSrc, `'nonce-${cspNonce}'`],
      styleSrc: [...cspConfig.directives.styleSrc, `'nonce-${cspNonce}'`],
    },
  };

  /**
   * Setup security headers
   */
  app.use(
    helmet({
      contentSecurityPolicy: cspConfigWithNonce,
      crossOriginEmbedderPolicy: {
        policy: "require-corp",
      },
      crossOriginOpenerPolicy: {
        policy: "same-origin",
      },
      crossOriginResourcePolicy: {
        policy: "same-site",
      },
      originAgentCluster: true,
      referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
      },
      strictTransportSecurity: {
        preload: true,
        maxAge: 31536000,
        includeSubDomains: true,
      },
      xContentTypeOptions: true,
      xDnsPrefetchControl: {
        allow: true,
      },
      xDownloadOptions: true,
      xFrameOptions: {
        action: "deny",
      },
      xPermittedCrossDomainPolicies: {
        permittedPolicies: "none",
      },
      xPoweredBy: false,
      xXssProtection: true,
    }),
  );

  /**
   * Enable Http Strict Transport Security (HSTS)
   */
  if (!isDevMode) app.set("trust proxy", 1);

  /**
   * Setup session management
   */
  app.use(session(sessionConfig));
};
