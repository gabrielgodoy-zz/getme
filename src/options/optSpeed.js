/* eslint-disable prefer-const */

let speedTest = require('speedtest-net');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora({
  text: 'Loading speed results, can take a few seconds',
  color: 'yellow',
});

function optSpeed() {
  spinner.start();
  const test = speedTest({ maxTime: 5000 });

  test.on('data', (data) => {
    spinner.stop();
    console.log(`\nDownload ${chalk.green(data.speeds.download)} Mbps`);
    console.log(`Upload ${chalk.blue(data.speeds.upload)} Mbps`);
    console.log(`Ping ${chalk.blue(data.server.ping)} ms`);
  });
  test.on('error', () => {
    console.log('An error ocurred');
  });
}

module.exports = optSpeed;
