import { request } from 'axios';

const imgproxy = async (req, res) => {
  const readable = await request({
    url: req.query.url,
    responseType: 'stream',
  });

  await readable.data.pipe(res);
};

export default imgproxy;
