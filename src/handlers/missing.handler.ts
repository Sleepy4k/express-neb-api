import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const missingHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(createError(404, "Your request couldn't be found!"));
}

export default missingHandler;