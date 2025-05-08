/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { parseHostname } from "@utils/parse.js";

/**
 * FAQ controller to send json response
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = (req: Request, res: Response) => {
  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);

  res.json({
    code: 200,
    status: "success",
    message: "List of frequently asked questions",
    data: [
      {
        question: "What is this bot?",
        answer: "This bot is a Telegram bot that provides various features such as bypassing safe exam and more.",
      },
      {
        question: "How do I use this bot?",
        answer: "You can use this bot by sending commands to it in a chat, e.g., /start to begin.",
      },
      {
        question: "Where can I find more information?",
        answer: `You can find more information on our website. Please visit ${baseUrl} for more details.`,
      },
      {
        question: "How do I contact support?",
        answer: `You can contact support by sending a message to our support channel at ${baseUrl}/contact.`,
      },
      {
        question: "How do I purchase a token or subscription?",
        answer: `You can purchase a token or subscription by visiting our payment page at ${baseUrl}/pricing.`,
      },
      {
        question: "How to bypassing exam?",
        answer: `After you get the result from the bot, you can use the result to bypass the exam. Please follow the instructions provided in our website at ${baseUrl}/tutorial.`,
      },
    ],
  });
};

export { home };
