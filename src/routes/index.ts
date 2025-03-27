import express from "express";

import api from "./api.js";
import web from "./web.js";

const router = express.Router();

router.use("/", web);
router.use("/api", api);

export default router;
