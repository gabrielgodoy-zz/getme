const chalk = require('chalk');
const childProcess = require('child_process');

function optSearch(query) {
  const queryGoogle = 'https://www.google.com/search?q=';
  const searchQuery = query.join('+');
  const searchAddress = queryGoogle + searchQuery;

  console.log(chalk.blue(`Searching for "${query.join(' ')}" on Google`));
  setTimeout(() => {
    childProcess.exec(`open ${searchAddress}`, () => {
    });
  }, 300);
}

export default optSearch;
