/* eslint-disable perfectionist/sort-objects */
import type { NextFunction, Request, Response } from "express";

import { WEB_HEADER } from "@constants/auth-payload.js";
import { decryptAuthVerify } from "@utils/encryption.js";

/**
 * Web api middleware to check if the web token is valid
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const webApi = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers["x-web-token"] as string | undefined;

  if (!token || token === "") {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {
        web_token: "Web token is required",
      },
    });
    return;
  }

  if (decryptAuthVerify(token) !== WEB_HEADER) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {
        web_token: "Web token is invalid",
      },
    });
    return;
  }

  next();
};

export default webApi;
