import { appConfig } from "@config/app.config.js";
import generateNonce from "@utils/nonce.js";
import { normalizePort } from "@utils/parse.js";
import express, { type Express } from "express";

import handlers from "./handlers.js";
import middleware from "./middleware.js";
import provider from "./provider.js";
import routes from "./routes.js";

class App {
  public get dirname(): string {
    return this.#dirname;
  }

  public get instance(): Express {
    return this.#instance;
  }

  #cspNonce: string;
  #dirname: string
  #instance: Express;
  #isDevMode: boolean;

  public constructor(dirname: string) {
    this.#dirname = dirname;
    this.#instance = express();
    this.#cspNonce = generateNonce();
    this.#isDevMode = appConfig.env === "development" || appConfig.env === "local";

    this.configuration();
    this.setup();
  }

  private configuration(): void {
    this.#instance.set("host", appConfig.host);
    this.#instance.set("port", normalizePort(appConfig.port));
    this.#instance.set("cspNonce", this.#cspNonce);
  }

  private setup(): void {
    provider(this.#instance);
    middleware(this.#instance, this.#dirname, this.#isDevMode, this.#cspNonce);
    routes(this.#instance, this.#dirname);
    handlers(this.#instance);
  }
}

export default App;
