const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-date')(),
  require('metascraper-author')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-publisher')(),
  require('metascraper-logo')(),
  require('metascraper-audio')(),
  // require('metascraper-video')(),
  // require('metascraper-spotify')(),
  // require('metascraper-youtube')(),
  require('metascraper-url')(),
]);
import got from 'got';

const getMetadata = async (req, res) => {
  const { targetUrl } = JSON.parse(req.body);
  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });
  console.log({ metadata });
  res.json(metadata);
};

export default getMetadata;
