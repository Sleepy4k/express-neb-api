import { sha256 } from '@utils/encryption.js';
import type { Request, Response } from 'express';
import RedeemModel from '@models/redeem.model.js';
import { nameToRedeemCode } from '@utils/parse.js';
import { RedeemStatus } from '@enums/redeemStatus.js';
import { LOGIN_PAYLOAD } from '@constants/auth-payload.js';

/**
 * The redeem model instance
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * Home controller to render the home page
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = (req: Request, res: Response) => {
  const { payload } = req.query

  if (typeof payload !== 'string' || payload === '') {
    res.render('pages/guest');
    return;
  }

  const encryptedPayload = payload ? sha256(payload) : '';

  if (encryptedPayload !== LOGIN_PAYLOAD) {
    res.render('pages/guest');
    return;
  }

  res.render('pages/admin');
}

/**
 * Register redeem code controller
 *
 * @param {Request} req
 * @param {Response} res
 */
const registerRedeemCode = (req: Request, res: Response) => {
  const { name } = req.body

  if (!name || typeof name !== 'string') {
    res.status(400).send({
      status: 'error',
      message: 'Please provide a user name',
      data: [],
    });
    return;
  }

  const redeemByUser = redeemModel.findByName(name) || [];
  const increment = redeemByUser.length + 1;
  const redeemCode = `${nameToRedeemCode(name)}-${increment}`;

  const { code } = redeemModel.create(redeemCode, name);

  res.send({
    status: 'success',
    message: 'Redeem code registered',
    data: { redeem_code: code },
  });
}

/**
 * Find list redeem code controller
 *
 * @param {Request} req
 * @param {Response} res
 */
const findListRedeemCode = (req: Request, res: Response) => {
  const name = req.params.name;

  if (!name || typeof name !== 'string') {
    res.status(400).send({
      status: 'error',
      message: 'Please provide a user name',
      data: [],
    });
    return;
  }

  const redeemByUser = redeemModel.findByName(name)
    ?.filter((redeem) => redeem.status === RedeemStatus.PENDING);

  res.send({
    status: 'success',
    message: 'List redeem code',
    data: redeemByUser,
  });
}

export {
  home,
  registerRedeemCode,
  findListRedeemCode
};
