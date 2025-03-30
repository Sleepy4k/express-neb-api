import type { Request, Response } from "express";

/**
 * The home function to render the service page
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/service");
};

export { home };
