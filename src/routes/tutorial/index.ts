import { Router } from 'express';

import * as hc from '@controllers/tutorial.controller.js';

const router = Router();

router.get('/', hc.home);

export default router;