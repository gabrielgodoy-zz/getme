import chalk from 'chalk';
import axios from 'axios';
import ora from 'ora';
import { OAuth2 } from 'oauth';
import urlencode from 'urlencode';

const spinner = ora({
  text: 'Loading Twitter results, can take a few seconds',
  color: 'yellow',
});
const CONSUMER_KEY = 'p5qURsUwMRxOw4AiN3yMkSuwg';
const SECRET = 'uVWQhRBl3cqsgJsoBpblKpG6kfgeUffFInanfGEoRpQybx2Bcx';
const oauth2 = new OAuth2(CONSUMER_KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);

function getAccessToken() {
  return new Promise((resolve, reject) => {
    oauth2.getOAuthAccessToken('', { grant_type: 'client_credentials' }, (error, accessToken) => {
      if (error) {
        return reject(error);
      }

      return resolve(accessToken);
    });
  });
}

async function searchTwitter(query) {
  const searchQuery = urlencode(query);

  spinner.start();

  try {
    const accessToken = await getAccessToken();

    const config = {
      params: { q: searchQuery },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const { data, status: statusCode } = await axios.get('https://api.twitter.com/1.1/search/tweets.json', config);

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}

module.exports = async function optTwitter(query) {
  const searchQuery = query.join(' ');

  try {
    const data = await searchTwitter(searchQuery);

    const tweets = data.statuses;

    if (!tweets.length) {
      spinner.stop();
      console.log('No tweets to show!');
      process.exit();
    }

    spinner.stop();
    tweets.slice(10);

    tweets.forEach((t) => {
      console.log(`${chalk.yellow('From:')} ${t.user.name}`);
      console.log(`${chalk.yellow('Tweet:')} ${t.text}`);
      console.log(`${chalk.yellow('Time:')} ${t.created_at}\n`);
    });
  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Error searching tweets: ${err}`));
    process.exit();
  }
};

