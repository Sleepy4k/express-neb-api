/* eslint-disable perfectionist/sort-objects */
import type { Options as SMTPTransportOptions } from "nodemailer/lib/smtp-transport/index.js";

import dotenv from "dotenv";

dotenv.config();

const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 0;

export const smtpConfig: SMTPTransportOptions = {
  host: process.env.SMTP_HOST ?? "",
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
};
