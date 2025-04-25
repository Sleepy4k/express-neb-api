import * as loginController from "@controllers/web/auth/login.controller.js";
import * as logoutController from "@controllers/web/auth/logout.controller.js";
import * as dashboardController from "@controllers/web/dashboard/dashboard.controller.js";
import * as generateController from "@controllers/web/dashboard/generate.controller.js";
import * as historyController from "@controllers/web/dashboard/history.controller.js";
import * as tokenController from "@controllers/web/dashboard/token.controller.js";
import * as homeController from "@controllers/web/landing/home.controller.js";
import * as serviceController from "@controllers/web/landing/service.controller.js";
import * as tutorialController from "@controllers/web/landing/tutorial.controller.js";
import * as sebController from "@controllers/web/service/seb.controller.js";
import authenticationHandler from "@middleware/authentication.js";
import { sebFileUploader } from "@middleware/fileUploader.js";
import { Router } from "express";

const webRouter = Router();

webRouter.get("/", homeController.home);

webRouter.get("/login", authenticationHandler, loginController.form);
webRouter.post("/login", authenticationHandler, loginController.process);
webRouter.delete("/logout", authenticationHandler, logoutController.process);

webRouter.get("/service", serviceController.home);

webRouter.get("/service/seb", sebController.form);
webRouter.post("/service/seb", sebController.missUrl);
webRouter.post("/service/seb/:redeemCode", sebFileUploader.single("file"), sebController.bypass);

webRouter.get("/tutorial", tutorialController.home);

webRouter.get("/dashboard", authenticationHandler, dashboardController.home);
webRouter.get("/dashboard/generate", authenticationHandler, generateController.home);
webRouter.post("/dashboard/generate", authenticationHandler, generateController.process);
webRouter.get("/dashboard/history", authenticationHandler, historyController.home);
webRouter.get("/dashboard/token", authenticationHandler, tokenController.home);

export default webRouter;
