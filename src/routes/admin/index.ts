import { Router } from 'express';

import * as ac from '@controllers/admin.controller.js';

const router = Router();

router.get('/', ac.home);
router.post('/generate', ac.registerRedeemCode);
router.get('/list/:name', ac.findListRedeemCode);

export default router;