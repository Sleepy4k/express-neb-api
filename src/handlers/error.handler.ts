import { appConfig } from "@config";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.locals.message = err.message;
  res.locals.error = appConfig.env === 'development' ? err : {};

  res.status(err.status || 500);

  res.render("pages/error", function(err: any, html: any) {
    if (err) {
      res.send({
        status: "error",
        message: "An error occurred! Missing view directory?",
        data: {
          message: res.locals.message,
          error: res.locals.error
        }
      });
    } else {
      res.send(html);
    }
  });
}

export default errorHandler;