'use strict';

/* eslint-disable prefer-const */

var speedTest = require('speedtest-net');
var chalk = require('chalk');
var ora = require('ora');

var spinner = ora({
  text: 'Loading speed results, can take a few seconds',
  color: 'yellow'
});

function optSpeed() {
  spinner.start();
  var test = speedTest({ maxTime: 5000 });

  test.on('data', function (data) {
    spinner.stop();
    console.log('\nDownload ' + chalk.green(data.speeds.download) + ' Mbps');
    console.log('Upload ' + chalk.blue(data.speeds.upload) + ' Mbps');
    console.log('Ping ' + chalk.blue(data.server.ping) + ' ms');
  });
  test.on('error', function () {
    console.log('An error ocurred');
  });
}

module.exports = optSpeed;