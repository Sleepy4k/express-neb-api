import viewServiceProvider from "@providers/view.provider.js";
import apiRouter from "@routes/api.js";
import webRouter from "@routes/web.js";
import ejsMate from "ejs-mate";
import { Express } from "express";
import path from "node:path";

export default (app: Express, dirname: string): void => {
  /**
   * Set view engine
   */
  app.engine("ejs", ejsMate);
  app.use(viewServiceProvider);
  app.set("view engine", "ejs");
  app.set("views", path.join(dirname, "views"));

  /**
   * Set routes
   */
  app.use("/", webRouter);
  app.use("/api", apiRouter);
};
