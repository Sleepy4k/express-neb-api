import type { Request, Response } from "express";

/**
 * The home function to render the contact page
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/contact");
};

export { home };
