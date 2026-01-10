/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { appConfig } from "@config";
import { parseHostname } from "@utils/parse.js";

const HomeController = {
  /**
   * Home controller to send json response
   *
   * @param {Request} req
   * @param {Response} res
   */
  index(req: Request, res: Response) {
    res.json({
      code: 200,
      status: "success",
      message: "Welcome to the API",
      data: {
        name: appConfig.name,
        host: parseHostname(`${req.protocol}://${req.get("host") ?? ""}`),
      },
    });
  },
};

export default HomeController;
