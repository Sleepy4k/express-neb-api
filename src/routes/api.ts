import * as homeController from "@controllers/api/home.controller.js";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/", homeController.home);

export default apiRouter;
