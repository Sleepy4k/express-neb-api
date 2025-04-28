import type { NextFunction, Request, Response } from "express";

import { LOGIN_PAYLOAD } from "@constants/auth-payload.js";
import HIDDEN_PARAMS from "@constants/hidden-params.js";
import UserModel from "@models/user.model.js";
import { decryptAuthVerify, sha256 } from "@utils/encryption.js";
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
const authenticationHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  if (req.session.user?.email) {
    if (req.path === "/login") {
      res.redirect(baseUrl);
      return;
    }

    const user = await userModel.find(req.session.user.email);

    if (!user || user.password !== req.session.user.password) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
        }
      });
      res.redirect(`${baseUrl}/login`);
      return;
    }

    if (!req.session.user.verified) {
      if (decryptAuthVerify((req.query.verificator as string) || "") != `${user.email}${req.session.user.role}`) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destruction error:", err);
          }
        });
        res.redirect(`${baseUrl}/login?error=verify`);
        return;
      }

      req.session.user.verified = true;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        }
      });

      // remove the query parameter from the URL
      const url = new URL(req.url, baseUrl);
      url.searchParams.delete("verificator");
      res.redirect(url.toString());
      return;
    }

    next();
  } else if (req.path === "/login") {
    if (req.method === "POST") {
      const queryParam = req.query;

      for (const key in queryParam) {
        if (key === "jawa" || key === "geng") continue;

        if ((typeof queryParam[key] !== "string" || queryParam[key] !== "") && HIDDEN_PARAMS.includes(key)) {
          res.status(200).send({
            data: {
              redirect_url: `${baseUrl}/illegal-action/due-hidden-param/`,
              verificator: null,
            },
            message: "Login successfully, but some hidden parameters are provided, goodbye",
            status: "success",
          });
          return;
        }
      }

      if (typeof queryParam.jawa !== "string" || queryParam.jawa === "" || sha256(queryParam.jawa || "") !== LOGIN_PAYLOAD) {
        res.status(400).send({
          data: {},
          message: "Unauthorized access, please contact the administrator if you think this is a mistake",
          status: "error",
        });
        return;
      }
    }

    next();
  } else {
    res.redirect(`${baseUrl}/login`);
  }
};

export default authenticationHandler;
