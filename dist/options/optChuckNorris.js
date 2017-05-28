'use strict';

var request = require('request');
var chalk = require('chalk');
var ora = require('ora');

var spinner = ora({
  text: 'Waiting Chuck Norris, you have no option.',
  color: 'yellow'
});

function optChuck() {
  spinner.start();

  request('https://api.chucknorris.io/jokes/random', function (error, response, body) {
    var apiResponse = void 0;

    try {
      spinner.stop();
      apiResponse = JSON.parse(body);
    } catch (parseError) {
      spinner.stop();
      console.log('Chuck is busy now, try again later.');
      return false;
    }

    if ('error' in apiResponse) {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    return console.log('Chuck says: ' + chalk.red(JSON.parse(body).value));
  });
}

module.exports = optChuck;