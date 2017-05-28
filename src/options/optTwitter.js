const chalk = require('chalk');
const https = require('https');
const ora = require('ora');
const OAuth2 = require('oauth').OAuth2;
const urlencode = require('urlencode');

const spinner = ora({
  text: 'Loading Twitter results, can take a few seconds',
  color: 'yellow',
});
const CONSUMER_KEY = 'p5qURsUwMRxOw4AiN3yMkSuwg';
const SECRET = 'uVWQhRBl3cqsgJsoBpblKpG6kfgeUffFInanfGEoRpQybx2Bcx';
const oauth2 = new OAuth2(CONSUMER_KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);

function searchTwitter(query, cb) {
  const searchQuery = urlencode(`${query}`);
  spinner.start();
  oauth2.getOAuthAccessToken('', {
    grant_type: 'client_credentials',
  }, (error, accessToken) => {
    const options = {
      hostname: 'api.twitter.com',
      path: `/1.1/search/tweets.json?q=${searchQuery}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    https.get(options, (result) => {
      let buffer = '';
      result.setEncoding('utf8');
      result.on('data', (data) => {
        buffer += data;
      });
      result.on('end', () => {
        const tweets = JSON.parse(buffer);
        cb(error, tweets);
      });
    });
  });
}

function optTwitter(query) {
  const searchQuery = query.join(' ');
  searchTwitter(searchQuery, (err, data) => {
    if (err) {
      spinner.stop();
      console.log(chalk.red(`Error searching tweets: ${err}`));
      process.exit();
    }

    const tweets = data.statuses;
    if (!tweets.length) {
      spinner.stop();
      console.log('No tweets to show!');
      process.exit();
    }
    spinner.stop();
    tweets.slice(10);
    tweets.forEach((t) => {
      console.log(`${chalk.yellow('From :')}  ${t.user.name}`);
      console.log(`${chalk.yellow('Tweet :')}  ${t.text}`);
      console.log(`${chalk.yellow('Time :')}  ${t.created_at} \n`);
    });
  });
}

module.exports = optTwitter;
