import type { Request, Response } from "express";

import { appConfig } from "@config/app.config.js";

/**
 * Home controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/home", {
    app_name: appConfig.name,
  });
};

export { home };
