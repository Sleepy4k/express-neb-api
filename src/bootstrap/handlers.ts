import applicationErrorHandler from "@middleware/applicationError.js";
import routeMissingHandler from "@middleware/routeMissing.js";
import { Express } from "express";

export default (app: Express): void => {
  /**
   * Catch 404 and forward to error handler
   */
  app.use(applicationErrorHandler);

  /**
   * Set error handler
   */
  app.use(routeMissingHandler);
};
