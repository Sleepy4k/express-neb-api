import express from 'express';
import { appConfig } from '../config';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(`Welcome to ${appConfig.name}`);
});

export default router;