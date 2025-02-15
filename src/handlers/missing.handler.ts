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
 * @param {Request} _req
 * @param {Response} _res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const missingHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(errorInstance);
};

export default missingHandler;
