import type { NextFunction, Request, Response } from "express";

import UserModel from "@models/user.model.js";
import { parseHostname } from "@utils/parse.js";

/**
 * The user model instance
 *
 * @type {UserModel}
 */
const userModel: UserModel = new UserModel();

/**
 * Authentication handler middleware to check if the user is authenticated
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const authenticationHandler = (req: Request, res: Response, next: NextFunction): void => {
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  if (req.session.user?.email) {
    if (req.path === "/login") {
      res.redirect(baseUrl);
      return;
    }

    const user = userModel.find(req.session.user.email);

    if (!user || user.password !== req.session.user.password) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
        }
      });
      res.redirect(`${baseUrl}/login`);
      return;
    }

    next();
  } else if (req.path === "/login") {
    next();
  } else {
    res.redirect(`${baseUrl}/login`);
  }
};

export default authenticationHandler;
