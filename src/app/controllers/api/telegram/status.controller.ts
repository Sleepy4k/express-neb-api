/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { appConfig } from "@config";
import { parseHostname } from "@utils/parse.js";

/**
 * Status controller to send json response
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = (req: Request, res: Response) => {
  res.json({
    code: 200,
    status: "success",
    message: "Service working correctly",
    data: {
      name: appConfig.name,
      host: parseHostname(`${req.protocol}://${req.get("host") ?? ""}`),
    },
  });
};

export { home };
