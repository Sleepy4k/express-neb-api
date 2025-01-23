import createError from "http-errors";
import type {
  Request,
  Response,
  NextFunction
} from "express";

/**
 * Missing handler middleware to catch all missing requests
 *
 * @param {Request} _req
 * @param {Response} _res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const missingHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(createError(404, "Your request couldn't be found!"));
}

export default missingHandler;