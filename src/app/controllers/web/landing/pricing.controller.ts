import type { Request, Response } from "express";

/**
 * Pricing controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/pricing");
};

export { home };
