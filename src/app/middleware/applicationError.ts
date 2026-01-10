/* eslint-disable perfectionist/sort-objects */
import type { ErrorRequestHandler, Request, Response } from "express";

/**
 * Error handler middleware to catch all errors
 *
 * @param {any} err
 * @param {Request} _req
 * @param {Response} res
 *
 * @returns {void}
 */
const applicationErrorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response): void => {
  const error = err as { message?: string; status?: number };

  res.status(error.status ?? 500).json({
    code: error.status ?? 500,
    status: "error",
    message: error.message ?? "An error occurred!",
    data: {
      path: req.path,
      method: req.method,
      hostname: req.hostname,
      protocol: req.protocol,
    },
  });
};

export default applicationErrorHandler;
