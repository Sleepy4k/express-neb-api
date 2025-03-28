import * as ac from "@controllers/web/admin.controller.js";
import * as hc from "@controllers/web/home.controller.js";
import * as sc from "@controllers/web/service.controller.js";
import * as tc from "@controllers/web/tutorial.controller.js";
import fileUploader from "@middleware/fileUploader.js";
import { Router } from "express";

const webRouter = Router();

webRouter.get("/", hc.home);

webRouter.get("/service", sc.form);
webRouter.post("/service", sc.missUrl);
webRouter.post("/service/:redeemCode", fileUploader.single("file"), sc.bypass);

webRouter.get("/tutorial", tc.home);

webRouter.get("/dashboard", ac.home);
webRouter.post("/dashboard/generate", ac.registerRedeemCode);
webRouter.get("/dashboard/list/:name", ac.findListRedeemCode);

export default webRouter;
