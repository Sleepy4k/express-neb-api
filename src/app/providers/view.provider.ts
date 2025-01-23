import generateNonce from '@utils/nonce.js';
import type {
  Request,
  Response,
  NextFunction
} from 'express';

/**
 * Set up the view service provider for the Express app
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @returns {void}
 */
const viewServiceProvider = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
