import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

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

  res.status(error.status ?? 500);

  res.render("pages/error", {
    message: error.message ?? "An error occurred!",
    status: error.status ?? 500,
  }, function (err: Error | null, html: string) {
    if (!err) {
      res.send(html);
      return;
    }

    res.send({
      data: {
        message: res.locals.message as string,
        status: res.locals.status as number,
      },
      message: "An error occurred! Missing view directory?",
      status: "error",
    });
  });
};

export default applicationErrorHandler;
