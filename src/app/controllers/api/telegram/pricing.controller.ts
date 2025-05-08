/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { PRICING_PAYMENT_URL, TOKEN_PRICING } from "@constants/pricing.js";

/**
 * Pricing controller to send json response
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  res.json({
    code: 200,
    status: "success",
    message: "List of available pricing",
    data: {
      payment_url: PRICING_PAYMENT_URL,
      data: TOKEN_PRICING.map((item) => ({
        id: item.id,
        name: item.name,
        popular: item.badge.enabled,
        price: item.price,
        display_price: item.displayPrice,
        token: item.token,
        token_display: item.tokenDisplay,
        description: item.description,
      })),
    },
  });
};

export { home };
