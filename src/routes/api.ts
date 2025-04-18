import * as datatable from "@controllers/api/datatable.controller.js";
import * as homeController from "@controllers/api/home.controller.js";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/", homeController.home);

apiRouter.get("/datatable/config", datatable.configuration);
apiRouter.get("/datatable/localisation", datatable.localisation);

export default apiRouter;
