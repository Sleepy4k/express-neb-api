import applicationErrorHandler from "@middleware/applicationError.js";
import routeMissingHandler from "@middleware/routeMissing.js";
import { type Express } from "express";

export default (app: Express): void => {
  /**
   * Set error handler
   */
  app.use(routeMissingHandler);

  /**
   * Catch 404 and forward to error handler
   */
  app.use(applicationErrorHandler);
};
