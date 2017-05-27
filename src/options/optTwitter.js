const chalk = require('chalk');
const https = require('https');
const ora = require('ora');
const OAuth2 = require('oauth').OAuth2;

const spinner = ora({
  text: 'Loading Twitter results, can take a few seconds',
  color: 'yellow',
});
const CONSUMER_KEY = 'p5qURsUwMRxOw4AiN3yMkSuwg';
const SECRET = 'uVWQhRBl3cqsgJsoBpblKpG6kfgeUffFInanfGEoRpQybx2Bcx';
const oauth2 = new OAuth2(CONSUMER_KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);

function searchTwitter(query, cb) {
  spinner.start();
  oauth2.getOAuthAccessToken('', {
    grant_type: 'client_credentials',
  }, (error, accessToken) => {
    const options = {
      hostname: 'api.twitter.com',
      path: `/1.1/search/tweets.json?q=${query}`,
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
  const searchQuery = query.join(',');
  searchTwitter(searchQuery, (err, data) => {
    if (err) {
      spinner.stop();
      console.log(chalk.red(`Error searching tweets: ${err}`));
      process.exit();
    }

    const tweets = data.statuses;
    spinner.stop();
    for (let i = 0; i < tweets.length; i + 1) {
      const tweet = tweets[i];
      console.log(`${chalk.yellow('From :')}  ${tweet.user.name}`);
      console.log(`${chalk.yellow('Tweet :')}  ${tweet.text}`);
      console.log(`${chalk.yellow('Time :')}  ${tweet.created_at} \n`);
    }
  });
}

module.exports = optTwitter;
