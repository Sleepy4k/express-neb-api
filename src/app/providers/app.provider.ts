import type { NextFunction, Request, Response } from "express";

import { appConfig } from "@config/app.config.js";

/**
 * Set up the app service provider for the Express app
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const appServiceProvider = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.env = appConfig.env || "production";

  next();
};

export default appServiceProvider;
