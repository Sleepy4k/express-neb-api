/* eslint-disable perfectionist/sort-objects */
import type { SessionOptions } from "express-session";

import CryptoES from "crypto-es";
import dotenv from "dotenv";

import { appConfig } from "./app.config.js";

dotenv.config();

export const sessionConfig: SessionOptions = {
  genid() {
    return CryptoES.lib.WordArray.random(16).toString();
  },
  secret: process.env.SESSION_SECRET ?? "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: appConfig.env === "production",
    httpOnly: true,
    sameSite: "strict",
  },
};
