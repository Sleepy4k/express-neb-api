/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

/**
 * Service controller to send json response
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const home = (_req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    status: "success",
    message: "List of available service",
    data: [
      {
        name: "Safe Exam Browser",
        coming_soon: false,
        features: [
          {
            name: "Bypass Safe Exam Browser restrictions",
            description: "Seamless",
          },
          {
            name: "Switch between applications freely",
            description: "Supported",
          },
          {
            name: "Quick and reliable results",
            description: "Instant",
          },
        ],
      },
      {
        name: "Kahoot",
        coming_soon: true,
        features: [],
      },
      {
        name: "Quizizz",
        coming_soon: true,
        features: [],
      },
    ],
  });
};

export { home };
