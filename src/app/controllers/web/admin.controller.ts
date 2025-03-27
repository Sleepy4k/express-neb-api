import type { Request, Response } from "express";

import { LOGIN_PAYLOAD } from "@constants/auth-payload.js";
import { RedeemStatus } from "@enums/redeemStatus.js";
import RedeemModel from "@models/redeem.model.js";
import { sha256 } from "@utils/encryption.js";
import { nameToRedeemCode } from "@utils/parse.js";

interface RegisterRedeemCodeRequest extends Request {
  body: {
    name: string;
  };
}

/**
 * The redeem model instance
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * Home controller to render the home page
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = (req: Request, res: Response) => {
  const { payload } = req.query;

  if (typeof payload !== "string" || payload === "") {
    res.render("pages/guest");
    return;
  }

  const encryptedPayload = payload ? sha256(payload) : "";

  if (encryptedPayload !== LOGIN_PAYLOAD) {
    res.render("pages/guest");
    return;
  }

  res.render("pages/admin");
};

/**
 * Register redeem code controller
 *
 * @param {Request} req
 * @param {Response} res
 */
const registerRedeemCode = (req: RegisterRedeemCodeRequest, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    res.status(400).send({
      data: [],
      message: "Please provide a user name",
      status: "error",
    });
    return;
  }

  const redeemByUser = redeemModel.findByName(name) ?? [];
  const increment = redeemByUser.length + 1;
  const redeemCode = `${nameToRedeemCode(name)}-${increment.toString()}`;

  const { code } = redeemModel.create(redeemCode, name);

  res.send({
    data: { redeem_code: code },
    message: "Redeem code registered",
    status: "success",
  });
};

/**
 * Find list redeem code controller
 *
 * @param {Request} req
 * @param {Response} res
 */
const findListRedeemCode = (req: Request, res: Response) => {
  const name = req.params.name;

  if (!name || typeof name !== "string") {
    res.status(400).send({
      data: [],
      message: "Please provide a user name",
      status: "error",
    });
    return;
  }

  const redeemByUser = redeemModel.findByName(name)?.filter((redeem) => redeem.status === RedeemStatus.PENDING);

  res.send({
    data: redeemByUser,
    message: "List redeem code",
    status: "success",
  });
};

export { findListRedeemCode, home, registerRedeemCode };
