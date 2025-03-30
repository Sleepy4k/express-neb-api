import type { Request, Response } from "express";

import { RedeemStatus } from "@enums/redeemStatus.js";
import { RoleType } from "@enums/roleType.js";
import RedeemModel from "@models/redeem.model.js";

/**
 * The redeem model instance for the dashboard controller
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
  const user = req.session.user;
  const isUserAdmin = user?.role === RoleType.ADMIN;
  const tokens = redeemModel.get();
  const availableTokens = tokens.filter((token) => {
    if (isUserAdmin) {
      return token.status === RedeemStatus.PENDING;
    }
    return token.status === RedeemStatus.PENDING && token.name === user?.email;
  });

  res.render("pages/dashboard/token", {
    tokens: availableTokens,
  });
};

export { home };
