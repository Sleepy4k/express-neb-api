declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string|undefined;
      APP_PORT: string|undefined;
      APP_ENV: string|undefined;
      APP_HOST: string|undefined;
    }
  }
}