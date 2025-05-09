import type { Request, Response } from "express";

import { PRICING_PAYMENT_URL, TOKEN_PRICING } from "@constants/pricing.js";

/**
 * Pricing controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/pricing", {
    data: TOKEN_PRICING.sort((a, b) => a.id - b.id),
    paymentURL: PRICING_PAYMENT_URL,
  });
};

export { home };
