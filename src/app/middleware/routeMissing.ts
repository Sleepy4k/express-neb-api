/* eslint-disable perfectionist/sort-objects */
import type { NextFunction, Request, Response } from "express";

import createError from "http-errors";

/**
 * Error instance for missing requests
 *
 * @type {Error}
 */
const errorInstance: Error = createError(404, "Your request couldn't be found!");

/**
 * Missing handler middleware to catch all missing requests
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const routeMissingHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (req.path.startsWith("/api") && !req.path.includes("/api-docs")) {
    res.status(404).json({
      code: 404,
      status: "error",
      message: "Your request couldn't be found!",
      data: {
        path: req.path,
        method: req.method,
        hostname: req.hostname,
        protocol: req.protocol,
      },
    });
  } else if (req.accepts("json") && !req.accepts("html")) {
    res.status(404).json({
      code: 404,
      status: "error",
      message: "Your request couldn't be found!",
      data: {
        path: req.path,
        method: req.method,
        hostname: req.hostname,
        protocol: req.protocol,
      },
    });
  } else {
    next(errorInstance);
  }
};

export default routeMissingHandler;
