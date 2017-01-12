const request = require('request');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora({
  text: 'Wainting Chuck Norris, you have no option.',
  color: 'yellow',
});

function optChuck() {
  spinner.start();

  request('https://api.chucknorris.io/jokes/random', (error, response, body) => {
    let apiResponse;

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

    return console.log(`Chuck says: ${chalk.red(JSON.parse(body).value)}`);
  });
}

module.exports = optChuck;
