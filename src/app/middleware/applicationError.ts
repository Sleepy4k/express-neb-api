/* eslint-disable perfectionist/sort-objects */
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
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const error = err as { message?: string; status?: number };

  if (req.path.startsWith("/api") && !req.path.includes("/api-docs")) {
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
  } else if (req.accepts("json") && !req.accepts("html")) {
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
  } else {
    res.status(error.status ?? 500);

    res.render(
      "pages/error",
      {
        message: error.message ?? "An error occurred!",
        status: error.status ?? 500,
      },
      function (err: Error | null, html: string) {
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
      },
    );
  }
};

export default applicationErrorHandler;
