/* eslint-disable perfectionist/sort-objects */
import { cspConfig, minifyConfig, sessionConfig } from "@config";
import { rateLimitConfig } from "@config";
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
   * Minify the response
   */
  app.use(minifyHTML(minifyConfig));

  /**
   * Setup default express middlewares
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(dirname, "public")));

  /**
   * Setup logger
   */
  app.use(logger(isDevMode ? "dev" : "combined"));

  /**
   * Setup CORS
   */
  app.use(
    cors({
      methods: "GET, POST, PUT, DELETE",
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
  app.use(helmet());
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.xssFilter());
  app.use(helmet.xXssProtection());
  app.use(helmet.xFrameOptions({ action: "deny" }));
  app.use(helmet.contentSecurityPolicy(cspConfigWithNonce));
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));
  app.use(helmet.dnsPrefetchControl({ allow: false }));
  app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: "none" }));

  // The Global Limiter Problem on Proxies, uncomment this if you are using a proxy
  // app.set('trust proxy', 1 /* number of proxies between user and server */)

  /**
   * Setup session management
   */
  app.use(session(sessionConfig));
};
