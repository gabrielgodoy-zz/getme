const chalk = require('chalk');
const childProcess = require('child_process');

function optSearch(commander) {
  const queryGoogle = 'https://www.google.com/search?q=';
  const searchQuery = commander.args.join('+');
  const searchAddress = queryGoogle + searchQuery;

  console.log(chalk.blue(`Searching for "${commander.args.join(' ')}" on Google`));
  setTimeout(() => {
    childProcess.exec(`open ${searchAddress}`, () => {
    });
  }, 300);
}

module.exports = optSearch;
