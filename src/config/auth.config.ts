import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  saltKey: process.env.AUTH_SALT_KEY ?? "default-salt-key",
};
