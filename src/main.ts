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

import { appConfig } from "@config";
import { normalizePort } from "@utils/parse.js";
import router from "@routes";
import viewServiceProvider from "@providers/view.provider.js";
import errorHandler from "@handlers/error.handler.js";
import missingHandler from "@handlers/missing.handler.js";

/**
 * Express instance
 */
const app: Express = express();

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
app.use(minifyHTML({
  override: true,
  exceptionUrls: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    removeEmptyAttributes: false,
  },
}));

/**
 * Setup middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup logger
 */
app.use(logger(appConfig.env === 'development' ? 'dev' : 'combined'));

/**
 * Setup CORS
 */
app.use(cors({
  origin: appConfig.env === 'development' ? '*' : appConfig.host,
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
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'preview.colorlib.com'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
}));

// The Global Limiter Problem on Proxies, uncomment this if you are using a proxy
// app.set('trust proxy', 1 /* number of proxies between user and server */)

/**
 * Rate limiter
 */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after an hour',
  standardHeaders: 'draft-8',
  legacyHeaders: true,
  // skip: (req: Request) => req.url === '/'
}));

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

/**
 * Set port and host into Express instance
 */
app.set('port', normalizePort(appConfig.port));
app.set('host', appConfig.host);

export default app;