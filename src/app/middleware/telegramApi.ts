/* eslint-disable perfectionist/sort-objects */
import type { NextFunction, Request, Response } from "express";

import { TELEGRAM_HEADER } from "@constants/auth-payload.js";

/**
 * Telegram api middleware to check if the telegram token is valid
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const telegramApi = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers["x-telegram-token"] !== TELEGRAM_HEADER) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {
        telegram_token: "Telegram token is required",
      },
    });
    return;
  }

  next();
};

export default telegramApi;
