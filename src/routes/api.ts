import * as hc from "@controllers/api/home.controller.js";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/", hc.home);

export default apiRouter;
