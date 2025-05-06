import dotenv from "dotenv";

dotenv.config();

export const trakteerConfig = {
  webhook: {
    token: process.env.TRAKTEER_WEBHOOK_TOKEN ?? "",
  },
};
