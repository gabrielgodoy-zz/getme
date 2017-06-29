import fs from 'fs';
import ini from 'ini';
import chalk from 'chalk';
import open from 'open';

require('babel-polyfill');

const config = ini.parse(fs.readFileSync('.git/config', 'utf-8'));

function openRepo() {
  if (!config) {
    console.log(chalk.red('No Git repo found'));
    return;
  }
  const url = config['remote "origin"'].url;

  open(url);
}

module.exports = openRepo;
