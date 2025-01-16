import { appConfig } from '@config';
import { NextFunction, Request, Response } from 'express';
import { parseHostname } from '@utils/parse.js';
import generateNonce from '@utils/nonce.js';

const viewServiceProvider = (req: Request, res: Response, next: NextFunction) => {
  res.locals.env = appConfig.env || 'production';
  res.locals.title = appConfig.name || 'Express TypeScript Neb';
  res.locals.description = 'Naka Exam Bypasser, a simple Express.js server that bypasses Safe Exam\'s security measures.';

  res.locals.baseUrl = `${parseHostname(appConfig.host)}:${appConfig.port}`;
  res.locals.cspNonce = generateNonce();

  res.locals.asset = (path?: string) => `${res.locals.baseUrl}/${path || ''}`;
  res.locals.route = (path?: string) => `${res.locals.baseUrl}/${path || ''}`;
  res.locals.isRouteActive = (route?: string) => {
    const currPath = req.baseUrl.split('/')[1];

    if (!route && currPath === '') return 'active';

    return currPath === route ? 'active' : '';
  }

  next();
}

export default viewServiceProvider;
