/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import faqList from "@constants/faq-list.js";

const FaqController = {
  /**
   * FAQ controller to send json response
   *
   * @param {Request} _req
   * @param {Response} res
   */
  index(_req: Request, res: Response) {
    res.json({
      code: 200,
      status: "success",
      message: "Frequently Asked Questions",
      data: faqList,
    });
  },
};

export default FaqController;
