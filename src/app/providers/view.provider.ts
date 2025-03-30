import type { NextFunction, Request, Response } from "express";

import { parseHostname } from "@utils/parse.js";

/**
 * Set up the view service provider for the Express app
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const viewServiceProvider = (req: Request, res: Response, next: NextFunction): void => {
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  res.locals.baseUrl = baseUrl;
  res.locals.isLoggedIn = req.session.user?.email ?? false;
  res.locals.cspNonce = (req.app.get("cspNonce") as string) || "";
  res.locals.asset = (path?: string) => `${baseUrl}/${path ?? ""}`;
  res.locals.route = (path?: string) => `${baseUrl}/${path ?? ""}`;
  res.locals.isRouteActive = (route?: string) => {
    const currPath = req.path === "/" ? "" : req.path.slice(1);
    if (!route && currPath === "") return "active";

    return currPath === route ? "active" : "";
  };

  next();
};

export default viewServiceProvider;
