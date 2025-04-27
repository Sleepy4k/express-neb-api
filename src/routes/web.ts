/* eslint-disable perfectionist/sort-imports */
import { Router } from "express";
import authenticationHandler from "@middleware/authentication.js";
import { contactFileUploader, sebFileUploader } from "@middleware/fileUploader.js";

// Controllers
import * as loginController from "@controllers/web/auth/login.controller.js";
import * as logoutController from "@controllers/web/auth/logout.controller.js";
import * as dashboardController from "@controllers/web/dashboard/dashboard.controller.js";
import * as generateController from "@controllers/web/dashboard/generate.controller.js";
import * as historyController from "@controllers/web/dashboard/history.controller.js";
import * as tokenController from "@controllers/web/dashboard/token.controller.js";
import * as contactController from "@controllers/web/landing/contact.controller.js";
import * as homeController from "@controllers/web/landing/home.controller.js";
import * as pricingController from "@controllers/web/landing/pricing.controller.js";
import * as serviceController from "@controllers/web/landing/service.controller.js";
import * as tutorialController from "@controllers/web/landing/tutorial.controller.js";
import * as sebController from "@controllers/web/service/seb.controller.js";
import * as contactStorageController from "@controllers/web/storage/contact.controller.js";

const webRouter = Router();

// Landing Pages
webRouter.get("/", homeController.home);
webRouter.get("/service", serviceController.home);
webRouter.get("/pricing", pricingController.home);
webRouter.get("/tutorial", tutorialController.home);
webRouter.get("/contact", contactController.home);
webRouter.post("/contact", contactFileUploader.single("file"), contactController.process);

// Authentication
webRouter.get("/login", authenticationHandler, loginController.form);
webRouter.post("/login", authenticationHandler, loginController.process);
webRouter.delete("/logout", authenticationHandler, logoutController.process);

// Service - SEB
webRouter.get("/service/seb", sebController.form);
webRouter.post("/service/seb", sebController.missUrl);
webRouter.post("/service/seb/:redeemCode", sebFileUploader.single("file"), sebController.bypass);

// Dashboard
webRouter.get("/dashboard", authenticationHandler, dashboardController.home);
webRouter.get("/dashboard/generate", authenticationHandler, generateController.home);
webRouter.post("/dashboard/generate", authenticationHandler, generateController.process);
webRouter.get("/dashboard/history", authenticationHandler, historyController.home);
webRouter.get("/dashboard/token", authenticationHandler, tokenController.home);

// Storage
webRouter.get("/storage/contact/{*filePath}", authenticationHandler, contactStorageController.home);

export default webRouter;
