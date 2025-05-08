/* eslint-disable perfectionist/sort-classes */
import { appConfig } from "@config/app.config.js";
import generateNonce from "@utils/nonce.js";
import { normalizePort } from "@utils/parse.js";
import express, { type Express } from "express";

import handlers from "./handlers.js";
import middleware from "./middleware.js";
import provider from "./provider.js";
import routes from "./routes.js";

class App {
  #cspNonce: string;
  #dirname: string;
  #instance: Express;
  #isDevMode: boolean;

  /**
   * Get path to the application directory
   *
   * @returns {string}
   */
  public get dirname(): string {
    return this.#dirname;
  }

  /**
   * Get the application instance
   *
   * @returns {string}
   */
  public get instance(): Express {
    return this.#instance;
  }

  /**
   * Create an instance of the application
   *
   * @param {string} dirname
   */
  public constructor(dirname: string) {
    this.#dirname = dirname;
    this.#instance = express();
    this.#cspNonce = generateNonce();
    this.#isDevMode = appConfig.env === "development" || appConfig.env === "local";

    this.configuration();
    this.setup();
  }

  /**
   * Setup the application configuration
   *
   * @returns {Express}
   */
  private configuration(): void {
    this.#instance.set("host", appConfig.host);
    this.#instance.set("port", normalizePort(appConfig.port));
    this.#instance.set("baseUrl", appConfig.host.includes("localhost") ? `${appConfig.host}:${appConfig.port.toString()}` : appConfig.host);
    this.#instance.set("cspNonce", this.#cspNonce);
    this.#instance.set("isDevMode", this.#isDevMode);
  }

  /**
   * Setup the application bootstrapping
   *
   * @returns {void}
   */
  private setup(): void {
    provider(this.#instance);
    middleware(this.#instance, this.#dirname, this.#isDevMode, this.#cspNonce);
    routes(this.#instance, this.#dirname);
    handlers(this.#instance);
  }
}

export default App;
