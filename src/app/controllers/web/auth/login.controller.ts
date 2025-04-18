import type { Request, Response } from "express";

import { RoleType } from "@enums/roleType.js";
import UserModel from "@models/user.model.js";
import { encryptAuthVerify, sha256 } from "@utils/encryption.js";
import { getCurrentDateTime, parseHostname } from "@utils/parse.js";

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
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const isRedirectUrlGuarded = redirectUrl?.includes("/login") || redirectUrl?.includes("/dashboard");

  res.render("pages/auth/login", {
    csrfToken: sha256(getCurrentDateTime()),
    redirect_url: isRedirectUrlGuarded ? baseUrl : (redirectUrl ?? baseUrl),
  });
};

/**
 * Login controller to process the login form
 *
 * @param {Request} req
 * @param {Response} res
 */
const process = (req: Request, res: Response) => {
  const headers = req.headers;
  const csrf = headers["csrf-token"] ?? headers["x-csrf-token"];
  if (typeof csrf !== "string" || csrf !== sha256(getCurrentDateTime())) {
    res.status(403).send({
      data: {},
      message: "We couldn't verify your request, please try again",
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

  const { geng } = req.query;
  const userRole = geng === RoleType.ADMIN || geng === RoleType.USER ? (geng as RoleType) : RoleType.USER;
  const userData = userModel.login(email, sha256(password), userRole);
  if (!userData) {
    res.status(400).send({
      data: {},
      message: "User not found or invalid credentials, please check your email and password",
      status: "error",
    });
    return;
  }

  const fixedUserRole = userRole === RoleType.USER ? RoleType.USER : userData.role;
  req.session.user = {
    email: userData.email,
    password: userData.password,
    role: fixedUserRole,
    verified: false,
  };

  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);
  res.status(200).json({
    data: {
      redirect_url: `${baseUrl}/dashboard/`,
      verificator: encryptAuthVerify(`${userData.email}${fixedUserRole}`),
    },
    message: "Login successfully",
    status: "success",
  });
};

export { form, process };
