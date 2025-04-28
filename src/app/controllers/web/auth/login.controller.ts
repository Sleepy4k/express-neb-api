import type { Request, Response } from "express";

import { RoleType } from "@enums/roleType.js";
import UserModel from "@models/user.model.js";
import { encryptAuthVerify, sha256 } from "@utils/encryption.js";
import { getCurrentDateTime, parseHostname } from "@utils/parse.js";

/**
 * The interface for the request body
 * @interface IProcessBody
 */
interface IProcessBody {
  email: string;
  password: string;
}

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
const process = async (req: Request<object, object, IProcessBody>, res: Response) => {
  const csrfToken = req.headers["csrf-token"] ?? req.headers["x-csrf-token"];
  if (!csrfToken || csrfToken !== sha256(getCurrentDateTime())) {
    res.status(403).json({
      data: {},
      message: "Invalid CSRF token. Please try again.",
      status: "error",
    });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    res.status(400).send({
      data: {},
      message: "Make sure to provide a valid email and password",
      status: "error",
    });
    return;
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = /^[a-zA-Z0-9!@#$%^&*]{6,}$/.test(password);
  if (!isValidEmail || !isValidPassword) {
    res.status(400).send({
      data: {
        email: isValidEmail ? undefined : email,
        emailFormatHint: isValidEmail ? undefined : "Include @ and . in the email address",
        passwordFormatHint: isValidPassword ? undefined : "Include letters, numbers, and special characters",
      },
      message: isValidEmail
        ? "Password must be at least 6 characters long and contain only letters, numbers, and special characters"
        : "Email must be a valid email address and not contain spaces",
      status: "error",
    });
    return;
  }

  const { geng } = req.query;
  const userRole = geng === RoleType.ADMIN || geng === RoleType.USER ? (geng as RoleType) : RoleType.USER;
  const userData = await userModel.login(email, sha256(password), userRole);
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
