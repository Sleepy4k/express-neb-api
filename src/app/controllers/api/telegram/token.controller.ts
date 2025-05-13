/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import RedeemModel from "@models/redeem.model.js";
import Sanitation from "@modules/sanitation.js";
import { parseHostname } from "@utils/parse.js";
import { type ParamsDictionary } from "express-serve-static-core";

/**
 * The interface for the request parameters
 * @interface IBypassParams
 * @extends ParamsDictionary
 */
interface IBypassParams extends ParamsDictionary {
  redeemCode: string;
}

/**
 * The redeem model instance for the service controller
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 *
 *
 * @param {Request} req - The request
 * @param {Response} res - The response
 */
const check = async (req: Request<IBypassParams, object, object>, res: Response) => {
  const redeemCode = req.params.redeemCode;

  if (!redeemCode || typeof redeemCode !== "string") {
    res.status(400).send({
      code: 400,
      status: "error",
      message: "Please provide a redeem code",
      data: {},
    });
    return;
  }

  const sanitazedRedeemCode = Sanitation.sanitizeRedeemCode(redeemCode);
  const redeem = await redeemModel.find(sanitazedRedeemCode);

  if (!redeem) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid redeem code",
      data: {},
    });
    return;
  }

  if (redeem.redeemedAt !== null) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Redeem code already used",
      data: {},
    });
    return;
  }

  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Bypass Safe Exam Browser",
    data: {
      redeem_code: redeemCode,
      bypass_url: `${baseUrl}/service`,
    },
  });
};

export { check };
