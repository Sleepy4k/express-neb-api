import type { Request, Response } from "express";

/**
 * Home controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/home");
};

export { home };
