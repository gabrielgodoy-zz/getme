'use strict';

var chalk = require('chalk');
var https = require('https');
var ora = require('ora');
var OAuth2 = require('oauth').OAuth2;
var urlencode = require('urlencode');

var spinner = ora({
  text: 'Loading Twitter results, can take a few seconds',
  color: 'yellow'
});
var CONSUMER_KEY = 'p5qURsUwMRxOw4AiN3yMkSuwg';
var SECRET = 'uVWQhRBl3cqsgJsoBpblKpG6kfgeUffFInanfGEoRpQybx2Bcx';
var oauth2 = new OAuth2(CONSUMER_KEY, SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);

function searchTwitter(query, cb) {
  var searchQuery = urlencode('' + query);
  spinner.start();
  oauth2.getOAuthAccessToken('', {
    grant_type: 'client_credentials'
  }, function (error, accessToken) {
    var options = {
      hostname: 'api.twitter.com',
      path: '/1.1/search/tweets.json?q=' + searchQuery,
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    };

    https.get(options, function (result) {
      var buffer = '';
      result.setEncoding('utf8');
      result.on('data', function (data) {
        buffer += data;
      });
      result.on('end', function () {
        var tweets = JSON.parse(buffer);
        cb(error, tweets);
      });
    });
  });
}

function optTwitter(query) {
  var searchQuery = query.join(' ');
  searchTwitter(searchQuery, function (err, data) {
    if (err) {
      spinner.stop();
      console.log(chalk.red('Error searching tweets: ' + err));
      process.exit();
    }

    var tweets = data.statuses;
    if (!tweets.length) {
      spinner.stop();
      console.log('No tweets to show!');
      process.exit();
    }
    spinner.stop();
    tweets.slice(10);
    tweets.forEach(function (t) {
      console.log(chalk.yellow('From :') + '  ' + t.user.name);
      console.log(chalk.yellow('Tweet :') + '  ' + t.text);
      console.log(chalk.yellow('Time :') + '  ' + t.created_at + ' \n');
    });
  });
}

module.exports = optTwitter;