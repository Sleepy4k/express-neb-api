import { Request, Response } from 'express';

const home = (_req: Request, res: Response) => {
  res.render('pages/home');
}

export {
  home,
};
