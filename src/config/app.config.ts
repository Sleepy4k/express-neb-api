import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  env: process.env.APP_ENV ?? "production",
  host: process.env.APP_HOST ?? "http://localhost",
  name: process.env.APP_NAME ?? "My App",
  port: process.env.APP_PORT ?? 3000,
};
