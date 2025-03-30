import type { Request, Response } from "express";

import RedeemModel from "@models/redeem.model.js";
import { nameToRedeemCode } from "@utils/parse.js";

/**
 * The redeem model instance for the dashboard controller
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * Generate controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/dashboard/generate");
};

/**
 * Generate controller to process the generate token form
 *
 * @param {Request} req
 * @param {Response} res
 */
const process = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { description } = req.body;

  if (typeof description !== "string" || description === "") {
    res.status(400).send({
      data: [],
      message: "Make sure providing a valid description",
      status: "error",
    });
    return;
  }

  try {
    const name = req.session.user?.email;
    if (typeof name !== "string" || name === "") {
      res.status(400).send({
        data: [],
        message: "It seems like you are not logged in",
        status: "error",
      });
      return;
    }
    const totalUserRedeemCode = redeemModel.countByName(name);
    const uniqueSuffix = Math.floor(Math.random() * 10000).toString();
    const redeemCode = `${nameToRedeemCode(name.split('@')[0])}-${uniqueSuffix}-${totalUserRedeemCode.toString()}`;
    const token = redeemModel.create(redeemCode, name, description);

    res.status(200).send({
      data: {
        redeem_code: token.code,
      },
      message: "Token generated successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      data: [],
      message: "An error occurred while generating the token",
      status: "error",
    });
  }
};

export { home, process };
