import fs from 'fs';
import ini from 'ini';
import chalk from 'chalk';
import open from 'open';

require('babel-polyfill');

function openRepo() {
  try {
    const config = ini.parse(fs.readFileSync('.git/config', 'utf-8'));
    const url = config['remote "origin"'].url;
    const isSSHRemoteUrl = url.indexOf('git@') > -1;
    let finalUrl;

    if (isSSHRemoteUrl) {
      finalUrl = `http://${url.replace('git@', '').replace(':', '/').replace('.git', '')}`;
    } else {
      finalUrl = url;
    }

    open(finalUrl);
  } catch (err) {
    console.log(chalk.red('No Git repo found'));
  }
}

module.exports = openRepo;
