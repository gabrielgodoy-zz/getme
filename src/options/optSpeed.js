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
    console.log(`
Download ${chalk.green(data.speeds.download)} Mbps
Upload ${chalk.blue(data.speeds.upload)} Mbps
Ping ${chalk.blue(data.server.ping)} ms
`);
  });
  test.on('error', () => {
    console.log('An error ocurred');
  });
}

module.exports = optSpeed;
