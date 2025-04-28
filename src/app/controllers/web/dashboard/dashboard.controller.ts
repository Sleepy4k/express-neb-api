/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { RedeemStatus } from "@enums/redeemStatus.js";
import { RoleType } from "@enums/roleType.js";
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
 * @param {Request} req
 * @param {Response} res
 */
const home = async (req: Request, res: Response) => {
  const user = req.session.user;
  const isUserAdmin = user?.role === RoleType.ADMIN;

  const users = await userModel.get();
  const totalUsers = users.length;
  const totalAdminAccess = users.filter((user) => user.role === RoleType.ADMIN).length;
  const totalUserAccess = users.filter((user) => user.role === RoleType.USER).length;

  const tokens = await redeemModel.get();
  const totalTokens = tokens.filter((token) => {
    if (isUserAdmin) return true;
    return token.name === user?.email;
  }).length;
  const totalRedeemed = tokens.filter((token) => {
    if (isUserAdmin) {
      return token.status === RedeemStatus.REDEEMED;
    }
    return token.status === RedeemStatus.REDEEMED && token.name === user?.email;
  }).length;
  const totalNotRedeemed = tokens.filter((token) => {
    if (isUserAdmin) {
      return token.status === RedeemStatus.PENDING;
    }
    return token.status === RedeemStatus.PENDING && token.name === user?.email;
  }).length;

  res.render("pages/dashboard/dashboard", {
    totalNotRedeemed,
    totalRedeemed,
    totalTokens,
    totalUsers,
    totalAdminAccess,
    totalUserAccess,
  });
};

export { home };
