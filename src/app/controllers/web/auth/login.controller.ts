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
 * @param {Request} req
 * @param {Response} res
 */
const form = (req: Request, res: Response) => {
  const previousUrl = req.get("Referer");
  const redirectUrl = typeof previousUrl === "string" ? previousUrl : undefined;
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  res.render("pages/auth/login", {
    redirect_url: redirectUrl ?? baseUrl,
  });
};

/**
 * Login controller to process the login form
 *
 * @param {Request} req
 * @param {Response} res
 */
const process = (req: Request, res: Response) => {
  const { authKey, role } = req.query;

  if (typeof authKey !== "string" || authKey === "" || sha256(authKey || "") !== LOGIN_PAYLOAD) {
    res.status(400).send({
      data: {},
      message: "Unauthorized access, please contact the administrator if you think this is a mistake",
      status: "error",
    });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, password } = req.body;

  if (typeof email !== "string" || email === "") {
    res.status(400).send({
      data: {},
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  if (typeof password !== "string" || password === "") {
    res.status(400).send({
      data: {},
      message: "Make sure providing a valid email and password",
      status: "error",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).send({
      data: {
        email: email,
        format: "Include @ and . in the email address",
      },
      message: "Invalid email format",
      status: "error",
    });
    return;
  }

  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).send({
      data: {
        format: "Include letters, numbers, and special characters",
        password: password,
      },
      message: "Password must be at least 6 characters long and contain only letters, numbers, and special characters",
      status: "error",
    });
    return;
  }

  const userRole = role === RoleType.ADMIN || role === RoleType.USER ? (role as RoleType) : RoleType.USER;
  const userData = userModel.login(email, sha256(password), userRole);
  if (!userData) {
    res.status(400).send({
      data: {},
      message: "User not found or invalid credentials, please check your email and password",
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
