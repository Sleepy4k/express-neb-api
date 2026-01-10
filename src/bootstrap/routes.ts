import apiRouter from "@routes/api.js";
import { type Express } from "express";

export default (app: Express): void => {
  /**
   * Set routes
   */
  app.use("/", apiRouter);
};
