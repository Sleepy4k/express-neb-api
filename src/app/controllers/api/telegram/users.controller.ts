/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import UserModel from "@models/user.model.js";

/**
 * The user model instance for the login controller
 *
 * @type {UserModel}
 */
const userModel: UserModel = new UserModel();

/**
 * Users controller to send json response
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = async (_req: Request, res: Response) => {
  const users = await userModel.get();

  res.json({
    code: 200,
    status: "success",
    message: "List of application user",
    data: {
      total: users.length,
      users: users.map((user) => ({
        email: user.email,
        name: user.email.split("@")[0],
        role: user.role.toString(),
      })),
    },
  });
};

export { home };
