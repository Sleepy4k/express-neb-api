/* eslint-disable perfectionist/sort-imports */
import { Router } from "express";

// Controllers
import * as datatableController from "@controllers/api/datatable.controller.js";
import * as homeController from "@controllers/api/home.controller.js";
import * as teleStatusController from "@controllers/api/telegram/status.controller.js";
import trakteerController from "@controllers/api/webhook/trakteer.controller.js";
import saweriaController from "@controllers/api/webhook/saweria.controller.js";
import telegramApi from "@middleware/telegramApi.js";

const apiRouter = Router();

// Home
apiRouter.get("/", homeController.home);

// Datatable
apiRouter.get("/datatable/config", datatableController.configuration);
apiRouter.get("/datatable/localisation", datatableController.localisation);

// Telegram
apiRouter.get("/telegram/status", telegramApi, teleStatusController.home);

// Webhook
apiRouter.post("/webhook/trakteer", trakteerController);
apiRouter.post("/webhook/saweria", saweriaController);

export default apiRouter;
