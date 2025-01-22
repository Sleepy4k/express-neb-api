import { Request, Response } from 'express';
import RedeemModel from '@models/redeem.model.js';
import { RedeemStatus } from '@enums/redeemStatus.js';

const redeemModel: RedeemModel = new RedeemModel();

/**
 * Home controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
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

  const rand = Math.floor(Math.random() * 1000);
  const reversedName = name.split('').reverse().join('').replaceAll(' ', '-');

  const redeemByUser = redeemModel.findByName(name);
  const redeemByUserLength = redeemByUser ? redeemByUser.length : 0;
  const increment = redeemByUserLength > 0 ? redeemByUserLength + 1 : 1;

  const { code } = redeemModel.create(`${rand}-${reversedName}-${increment}`, name);

  res.send({
    status: 'success',
    message: 'Redeem code registered',
    data: {
      redeem_code: code
    },
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
