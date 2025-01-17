import { Request, Response } from 'express';

const home = (_req: Request, res: Response) => {
  const TUTORIAL_LIST = [
    {
      thumbnail: 'https://wallpapers.com/images/hd/coding-background-9izlympnd0ovmpli.jpg',
      title: 'Tutorial 1',
      video_url: 'https://youtu.be/dQw4w9WgXcQ?si=ykWzm6b_oTypJoXh',
    },
  ];

  res.render('pages/tutorial', {
    data: TUTORIAL_LIST,
    tutorial_length: TUTORIAL_LIST.length,
  });
}

export {
  home,
};
