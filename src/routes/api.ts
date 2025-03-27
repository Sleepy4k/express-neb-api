import * as hc from "@controllers/api/home.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", hc.home);

export default router;
