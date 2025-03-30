import type { Request, Response } from "express";

import { RedeemStatus } from "@enums/redeemStatus.js";
import RedeemModel from "@models/redeem.model.js";
import UserModel from "@models/user.model.js";

/**
 * The redeem model instance for the dashboard controller
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * The user model instance for the dashboard controller
 *
 * @type {UserModel}
 */
const userModel: UserModel = new UserModel();

/**
 * Dashboard controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  const totalUsers = userModel.count();
  const tokens = redeemModel.get();
  const totalTokens = tokens.length;
  const totalRedeemed = tokens.filter((token) => token.status === RedeemStatus.REDEEMED).length;
  const totalNotRedeemed = tokens.filter((token) => token.status === RedeemStatus.PENDING).length;

  res.render("pages/dashboard/dashboard", {
    totalNotRedeemed,
    totalRedeemed,
    totalTokens,
    totalUsers,
  });
};

export { home };
