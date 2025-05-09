import dotenv from "dotenv";

dotenv.config();

export const saweriaConfig = {
  webhook: {
    token: process.env.SAWERIA_WEBHOOK_TOKEN ?? "",
  },
};
