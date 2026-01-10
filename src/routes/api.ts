/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable perfectionist/sort-imports */
import { Router } from "express";

// Controllers
import HomeController from "@controllers/home.controller.js";
import FaqController from "@controllers/faq.controller.js";
import ServiceController from "@controllers/service.controller.js";
import ContactController from "@controllers/contact.controller.js";

import { sebFileUploader } from "@middleware/fileUploader.js";
import webApi from "@middleware/webApi.js";

const apiRouter = Router();

// Home
apiRouter.get("/", HomeController.index);

// FAQ
apiRouter.get("/faq", FaqController.index);
apiRouter.get("/faqs", FaqController.index); // Legacy route

// Contact
apiRouter.post("/contact", ContactController.store);

// Service
apiRouter.get("/service", ServiceController.index);
apiRouter.post("/service", ServiceController.store);
apiRouter.post("/service/safe-exam-bypasser", webApi, sebFileUploader.single("file"), ServiceController.seb);
apiRouter.post("/service/kahoot-bypasser", webApi, ServiceController.kahoot);
apiRouter.post("/service/quizizz-bypasser", webApi, ServiceController.quizizz);

export default apiRouter;
