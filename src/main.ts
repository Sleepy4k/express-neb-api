import cors from "cors";
import ejsMate from "ejs-mate";
import { rateLimit } from 'express-rate-limit'
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import path from 'node:path';
import logger from "morgan";
import { fileURLToPath } from 'node:url';
import minifyHTML from 'express-minify-html-2';

import router from "@routes";
import { normalizePort } from "@utils/parse.js";
import errorHandler from "@handlers/error.handler.js";
import missingHandler from "@handlers/missing.handler.js";
import appServiceProvider from "@providers/app.provider.js";
import viewServiceProvider from "@providers/view.provider.js";
import {
  appConfig,
  cspConfig,
  minifyConfig,
  rateLimitConfig
} from "@config";

/**
 * Express instance
 */
const app: Express = express();

/**
 * Set port and host into Express instance
 */
app.set('host', appConfig.host);
app.set('port', normalizePort(appConfig.port));

/**
 * Set up the app service provider
 */
app.use(appServiceProvider);

/**
 * Get the directory name of the current module
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * View engine setup
 */
app.engine('ejs', ejsMate);
app.use(viewServiceProvider);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Minify the response
 */
app.use(minifyHTML(minifyConfig));

/**
 * Setup middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Check if the current environment is development
 */
const isDevMode = appConfig.env === 'development';

/**
 * Setup logger
 */
app.use(logger(isDevMode ? 'dev' : 'combined'));

/**
 * Setup CORS
 */
app.use(cors({
  origin: isDevMode ? '*' : appConfig.host,
  methods: 'GET, POST, PUT, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
}));

/**
 * Setup security headers
 */
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.xXssProtection());
app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// The Global Limiter Problem on Proxies, uncomment this if you are using a proxy
// app.set('trust proxy', 1 /* number of proxies between user and server */)

/**
 * Rate limiter
 */
app.use(rateLimit(rateLimitConfig));

/**
 * Routes initialization
 */
app.use('/', router);

/**
 * Catch 404 and forward to error handler
 */
app.use(missingHandler);

/**
 * Set error handler
 */
app.use(errorHandler);

export default app;
