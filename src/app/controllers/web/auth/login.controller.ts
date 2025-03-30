import type { Request, Response } from "express";

import { LOGIN_PAYLOAD } from "@constants/auth-payload.js";
import { RoleType } from "@enums/roleType.js";
import UserModel from "@models/user.model.js";
import { sha256 } from "@utils/encryption.js";
import { parseHostname } from "@utils/parse.js";

/**
 * The user model instance for the login controller
 *
 * @type {UserModel}
 */
const userModel: UserModel = new UserModel();

/**
 * Login controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const form = (_req: Request, res: Response) => {
  res.render("pages/auth/login");
};

/**
 * Login controller to process the login form
 *
 * @param {Request} req
 * @param {Response} res
 */
const process = (req: Request, res: Response) => {
  let userRole = RoleType.USER;
  const { authKey, role } = req.query;

  if (typeof authKey !== "string" || authKey === "" || sha256(authKey || "") !== LOGIN_PAYLOAD) {
    res.status(400).send({
      data: [],
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (typeof role !== "string" || role === "" || (role !== RoleType.ADMIN && role !== RoleType.USER)) {
    userRole = RoleType.USER;
  } else {
    userRole = role as RoleType;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, password } = req.body;

  if (typeof email !== "string" || email === "") {
    res.status(400).send({
      data: [],
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  if (typeof password !== "string" || password === "") {
    res.status(400).send({
      data: [],
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,}$/;

  if (!emailRegex.test(email) || !passwordRegex.test(password)) {
    res.status(400).send({
      data: [],
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  const userData = userModel.login(email, sha256(password), userRole);

  if (!userData) {
    res.status(400).send({
      data: [],
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  req.session.user = {
    email: userData.email,
    password: userData.password,
    role: userRole === RoleType.USER ? RoleType.USER : userData.role,
  };

  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);
  res.status(200).json({
    data: {
      redirect_url: `${baseUrl}/dashboard`,
    },
    message: "Login successfully",
    status: "success",
  });
};

export { form, process };
