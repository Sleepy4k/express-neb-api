import cors from "cors";
import createError from "http-errors";
import ejsMate from "ejs-mate";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import path from "path";
import logger from "morgan";

import { appConfig } from "./config";
import { normalizePort } from "./utils/parse";
import router from "./routes";
import viewServiceProvider from "./providers/view.provider";
import generateNonce from "./utils/nonce";

const app: Express = express();

app.engine('ejs', ejsMate);
app.use(viewServiceProvider);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger(appConfig.env === 'development' ? 'dev' : 'combined'));

app.use(cors({
  origin: appConfig.env === 'development' ? '*' : appConfig.host,
  methods: 'GET, POST, PUT, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
}));

app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.xXssProtection());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'", `'nonce-${generateNonce()}'`],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
}));

app.use('/', router);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = appConfig.env === 'development' ? err : {};
  res.status(err.status || 500);

  // res.render('error', {
  //   title: 'Error'
  // });

  res.json({
    message: err.message,
    error: err,
  });
});

app.set('port', normalizePort(appConfig.port));
app.set('host', appConfig.host);

export default app;