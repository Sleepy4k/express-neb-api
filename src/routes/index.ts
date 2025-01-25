import express from 'express';

import web from './web.js';

const router = express.Router();

router.use('/', web);

export default router;