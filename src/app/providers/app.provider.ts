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
  res.locals.title = appConfig.name || "Express TypeScript Neb";
  res.locals.description = "Nach Exam Bypasser (NEB): Effortlessly bypass online exam restrictions and get quick, reliable answers for your assignments. Free to use with a redeem code. Safe & private.";
  res.locals.currentYear = new Date().getFullYear();

  next();
};

export default appServiceProvider;
