import appServiceProvider from "@providers/app.provider.js";
import { Express } from "express";

export default (app: Express): void => {
  app.use(appServiceProvider);
};
