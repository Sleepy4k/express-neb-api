/* eslint-disable perfectionist/sort-imports */
import { Router } from "express";

// Controllers
import * as datatableController from "@controllers/api/datatable.controller.js";
import * as homeController from "@controllers/api/home.controller.js";
import trakteerController from "@controllers/api/webhook/trakteer.controller.js";

const apiRouter = Router();

// Home
apiRouter.get("/", homeController.home);

// Datatable
apiRouter.get("/datatable/config", datatableController.configuration);
apiRouter.get("/datatable/localisation", datatableController.localisation);

// Webhook
apiRouter.post("/webhook/trakteer", trakteerController);

export default apiRouter;
