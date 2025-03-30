import appServiceProvider from "@providers/app.provider.js";
import { type Express } from "express";

export default (app: Express): void => {
  app.use(appServiceProvider);
};
