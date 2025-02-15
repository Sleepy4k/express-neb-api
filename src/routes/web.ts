import * as ac from "@controllers/admin.controller.js";
import * as hc from "@controllers/home.controller.js";
import * as sc from "@controllers/service.controller.js";
import * as tc from "@controllers/tutorial.controller.js";
import fileUploader from "@middleware/fileUploader.js";
import { Router } from "express";

const router = Router();

router.get("/", hc.home);

router.get("/service", sc.form);
router.post("/service", sc.missUrl);
router.post("/service/:redeemCode", fileUploader.single("file"), sc.bypass);

router.get("/tutorial", tc.home);

router.get("/dashboard", ac.home);
router.post("/dashboard/generate", ac.registerRedeemCode);
router.get("/dashboard/list/:name", ac.findListRedeemCode);

export default router;
