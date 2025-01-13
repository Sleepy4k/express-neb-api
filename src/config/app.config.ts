import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  env: process.env.APP_ENV || 'production',
  host: process.env.APP_HOST || 'http://localhost',
  port: process.env.APP_PORT || 3000,
  name: process.env.APP_NAME || 'My App'
};
