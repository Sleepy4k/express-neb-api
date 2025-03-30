import type { Request, Response } from "express";

import { parseHostname } from "@utils/parse.js";

/**
 * Logout controller to process the logout form
 *
 * @param {Request} req
 * @param {Response} res
 */
const process = (req: Request, res: Response) => {
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({
        data: [],
        message: "Unable to logout",
        status: "error",
      });
      return;
    }

    res.status(200).send({
      data: {
        redirect_url: baseUrl,
      },
      message: "Logout successfully",
      status: "success",
    });
  });
};

export { process };
