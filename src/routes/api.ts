/* eslint-disable perfectionist/sort-imports */
import { Router } from "express";

// Controllers
import * as datatableController from "@controllers/api/datatable.controller.js";
import * as homeController from "@controllers/api/home.controller.js";
import * as teleStatusController from "@controllers/api/telegram/status.controller.js";
import * as telePricingController from "@controllers/api/telegram/pricing.controller.js";
import * as teleFAQController from "@controllers/api/telegram/faq.controller.js";
import * as teleUsersController from "../app/controllers/api/telegram/users.controller.js";
import * as teleServiceController from "../app/controllers/api/telegram/service.controller.js";
import * as teleTokenController from "../app/controllers/api/telegram/token.controller.js";
import * as teleSebController from "../app/controllers/api/telegram/seb.controller.js";
import trakteerController from "@controllers/api/webhook/trakteer.controller.js";
import saweriaController from "@controllers/api/webhook/saweria.controller.js";
import telegramApi from "@middleware/telegramApi.js";
import { sebFileUploader } from "../app/middleware/fileUploader.js";

const apiRouter = Router();

// Home
apiRouter.get("/", homeController.home);

// Datatable
apiRouter.get("/datatable/config", datatableController.configuration);
apiRouter.get("/datatable/localisation", datatableController.localisation);

// Telegram
apiRouter.get("/telegram/status", telegramApi, teleStatusController.home);
apiRouter.get("/telegram/pricing", telegramApi, telePricingController.home);
apiRouter.get("/telegram/faq", telegramApi, teleFAQController.home);
apiRouter.get("/telegram/users", telegramApi, teleUsersController.home);
apiRouter.get("/telegram/service", telegramApi, teleServiceController.home);
apiRouter.get("/telegram/service/check/:redeemCode", telegramApi, teleTokenController.check);
apiRouter.post("/telegram/service/seb", telegramApi, teleSebController.missUrl);
apiRouter.post("/telegram/service/seb/:redeemCode", telegramApi, sebFileUploader.single("file"), teleSebController.bypass);

// Webhook
apiRouter.post("/webhook/trakteer", trakteerController);
apiRouter.post("/webhook/saweria", saweriaController);

export default apiRouter;
