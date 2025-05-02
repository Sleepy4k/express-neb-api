import appServiceProvider from "@providers/app.provider.js";
import csrfServiceProvider from "@providers/csrf.provider.js";
import { type Express } from "express";

export default (app: Express): void => {
  /**
   * Register the application service provider
   */
  app.use(appServiceProvider);

  /**
   * Register the CSRF service provider
   */
  app.use(csrfServiceProvider);
};
