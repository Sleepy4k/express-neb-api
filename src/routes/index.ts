import express from 'express';

import home from './home/index.js';
import service from './service/index.js';
import tutorial from './tutorial/index.js';

const router = express.Router();

router.use('/', home);
router.use('/service', service);
router.use('/tutorial', tutorial);

export default router;