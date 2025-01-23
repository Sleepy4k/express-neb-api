import { appConfig } from '@config';
import { parseHostname } from '@utils/parse.js';
import type {
  Request,
  Response,
  NextFunction
} from 'express';

/**
 * Set up the app service provider for the Express app
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const appServiceProvider = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.locals.env = appConfig.env || 'production';
  res.locals.title = appConfig.name || 'Express TypeScript Neb';
  res.locals.description = 'Naka Exam Bypasser, a simple Express.js server that bypasses Safe Exam\'s security measures.';

  res.locals.baseUrl = `${parseHostname(appConfig.host)}:${appConfig.port}`;

  next();
}

export default appServiceProvider;
