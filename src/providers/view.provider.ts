import { NextFunction, Request, Response } from 'express';
import { appConfig } from '../config';
import { parseHostname } from 'src/utils/parse';
import generateNonce from 'src/utils/nonce';

const viewServiceProvider = (_req: Request, res: Response, next: NextFunction) => {
  res.locals.title = appConfig.name || 'Express TypeScript Neb';
  res.locals.description = 'Safe Exam Browser Bypasser Tool';
  res.locals.env = appConfig.env || 'production';
  res.locals.baseUrl = `${parseHostname(appConfig.host)}:${appConfig.port}`;
  res.locals.asset = (path?: string) => `${res.locals.baseUrl}/${path}`;
  res.locals.nonce = generateNonce();

  next();
}

export default viewServiceProvider;
