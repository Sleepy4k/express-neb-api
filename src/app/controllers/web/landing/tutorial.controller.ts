import type { Request, Response } from "express";

/**
 * The home function to render the tutorial page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/tutorial");
};

export { home };
