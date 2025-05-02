/* eslint-disable perfectionist/sort-objects */
import type { NextFunction, Request, Response } from "express";

import { sha256 } from "@utils/encryption.js";
import { getCurrentDateTime } from "@utils/parse.js";

/**
 * The list of URLs to be protected by CSRF
 * @type {Array<{ url: string; method: string[] }>}
 */
const urlList: { method: string[]; url: string }[] = [
  {
    url: "/contact",
    method: ["POST"],
  },
  {
    url: "/dashboard/contact/:type",
    method: [],
  },
  {
    url: "/dashboard/contact/:type/:id",
    method: ["DELETE"],
  },
  {
    url: "/login",
    method: ["POST"],
  },
];

/**
 * Set up the csrf service provider for the Express app
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const csrfServiceProvider = (req: Request, res: Response, next: NextFunction): void => {
  const method = req.method;
  const url = req.originalUrl.split("?")[0];

  const matchUrl = (pattern: string, url: string): boolean => {
    const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+").replace(/\/\[\^\/\]\+\$/, "(?:/[^/]+)?") + "$");
    return regex.test(url);
  };

  if (urlList.some((item) => matchUrl(item.url, url) && method === "GET")) {
    res.locals.csrfToken = sha256(getCurrentDateTime());
    next();
    return;
  }

  if (urlList.some((item) => matchUrl(item.url, url) && item.method.includes(method))) {
    const csrfToken = req.headers["csrf-token"] ?? req.headers["x-csrf-token"];
    if (!csrfToken || csrfToken !== sha256(getCurrentDateTime())) {
      res.status(403).json({
        data: {
          url,
          method,
        },
        message: "Invalid CSRF token. Please try again.",
        status: "error",
      });
      return;
    }
  }

  next();
};

export default csrfServiceProvider;
