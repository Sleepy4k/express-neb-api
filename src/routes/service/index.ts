import { Router } from 'express';

import * as sc from '@controllers/service.controller.js';
import fileUploader from '@middleware/fileUploader.js';

const router = Router();

router.get('/', sc.form);
router.post('/', sc.missUrl);
router.post('/:redeemCode', fileUploader.single('file'), sc.bypass);

export default router;