/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

/**
 * Missing handler middleware to catch all missing requests
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const routeMissingHandler = (req: Request, res: Response): void => {
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
};

export default routeMissingHandler;
