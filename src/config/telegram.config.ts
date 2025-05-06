/* eslint-disable perfectionist/sort-objects */
import dotenv from "dotenv";

dotenv.config();

export const telegramConfig = {
  chat_id: process.env.TELEGRAM_CHAT_ID ?? "",
  token: process.env.TELEGRAM_BOT_TOKEN ?? "",
  endpoint: process.env.TELEGRAM_API_ENDPOINT ?? "",
};
