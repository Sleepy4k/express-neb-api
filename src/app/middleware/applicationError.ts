import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { appConfig } from "@config";

/**
 * Error handler middleware to catch all errors
 *
 * @param {any} err
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} _next
 *
 * @returns {void}
 */
const applicationErrorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const error = err as { message?: string; status?: number };
  const isDevMode = appConfig.env === "development" || appConfig.env === "local";

  res.locals.error = isDevMode ? error : {};
  res.locals.message = error.message ?? "An error occurred!";
  res.locals.status = error.status ?? 500;

  res.status(error.status ?? 500);

  res.render("pages/error", function (err: Error | null, html: string) {
    if (!err) {
      res.send(html);
      return;
    }

    res.send({
      data: {
        error: isDevMode ? error : {},
        message: res.locals.message as string,
        status: res.locals.status as number,
      },
      message: "An error occurred! Missing view directory?",
      status: "error",
    });
  });
};

export default applicationErrorHandler;
