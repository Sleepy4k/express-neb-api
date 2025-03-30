import * as loginController from "@controllers/web/auth/login.controller.js";
import * as generateController from "@controllers/web/dashboard/generate.controller.js";
import * as homeController from "@controllers/web/landing/home.controller.js";
import * as serviceController from "@controllers/web/landing/service.controller.js";
import * as tutorialController from "@controllers/web/landing/tutorial.controller.js";
import * as sebController from "@controllers/web/service/seb.controller.js";
import authenticationHandler from "@middleware/authentication.js";
import fileUploader from "@middleware/fileUploader.js";
import { Router } from "express";

const webRouter = Router();

webRouter.get("/", homeController.home);

webRouter.get("/login", loginController.form);
webRouter.post("/login", loginController.process);

webRouter.get("/service", serviceController.home);

webRouter.get("/service/seb", sebController.form);
webRouter.post("/service/seb", sebController.missUrl);
webRouter.post("/service/seb/:redeemCode", fileUploader.single("file"), sebController.bypass);

webRouter.get("/tutorial", tutorialController.home);

webRouter.get("/dashboard", authenticationHandler, generateController.home);

export default webRouter;
