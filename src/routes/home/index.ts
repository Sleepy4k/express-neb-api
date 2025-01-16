import { Router } from 'express';

import * as hc from '@controllers/home.controller.js';

const router = Router();

router.get('/', hc.home);

export default router;