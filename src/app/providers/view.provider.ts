import type { NextFunction, Request, Response } from "express";

import { appConfig } from "@config";
import generateNonce from "@utils/nonce.js";
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
  let baseUrl: string;

  if (appConfig.env == "production") {
    baseUrl = parseHostname(appConfig.host);
  } else {
    baseUrl = `${parseHostname(appConfig.host)}:${appConfig.port.toString()}`;
  }

  res.locals.cspNonce = generateNonce();
  res.locals.baseUrl = baseUrl;
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
