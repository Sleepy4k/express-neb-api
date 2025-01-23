import type { Request, Response } from 'express';

/**
 * The home function to render the tutorial page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = (_req: Request, res: Response) => {
  const TUTORIAL_LIST = [
    {
      title: 'How to use our service?!',
      description: 'Maybe you are wondering how to use our service, right? Well, it is simple! Just follow the steps below and you will be able to bypass the exam security in no time!',
      thumbnail: 'https://wallpapers.com/images/hd/coding-background-9izlympnd0ovmpli.jpg',
      video_url: 'https://youtu.be/dQw4w9WgXcQ?si=ykWzm6b_oTypJoXh',
    },
    {
      title: 'Where to find the exam configuration file?',
      description: 'The exam configuration file is located in the moodle exam page (download button) or change the link from "seb://" into "https://". You can find it by following the steps below:',
      thumbnail: 'https://wallpapers.com/images/hd/coding-background-9izlympnd0ovmpli.jpg',
      video_url: 'https://youtu.be/dQw4w9WgXcQ?si=ykWzm6b_oTypJoXh',
    },
    {
      title: 'How to bypass the exam security after getting the bypass json code?',
      description: 'After getting the bypass json code, you can press the download json button and inject json into your exam. You can bypass the exam security by following the steps below:',
      thumbnail: 'https://wallpapers.com/images/hd/coding-background-9izlympnd0ovmpli.jpg',
      video_url: 'https://youtu.be/dQw4w9WgXcQ?si=ykWzm6b_oTypJoXh',
    }
  ];

  res.render('pages/tutorial', {
    data: TUTORIAL_LIST,
    tutorial_length: TUTORIAL_LIST.length,
  });
}

export {
  home,
};
