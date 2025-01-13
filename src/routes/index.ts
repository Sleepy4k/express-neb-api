import express from 'express';
// import { appConfig } from '../config';

const router = express.Router();

router.get('/', (_req, res) => {
  res.render('pages/home');
});

export default router;