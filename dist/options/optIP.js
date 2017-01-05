'use strict';

var request = require('request');
var chalk = require('chalk');
var ora = require('ora');
var os = require('os');

var spinner = ora({
  text: 'Loading IPs',
  color: 'yellow'
});

function getLocalIP() {
  var interfaces = os.networkInterfaces();
  var addresses = [];

  Object.keys(interfaces).forEach(function (netInterface) {
    interfaces[netInterface].forEach(function (interfaceObject) {
      if (interfaceObject.family === 'IPv4' && !interfaceObject.internal) {
        addresses.push(interfaceObject.address);
      }
    });
  });
  return addresses;
}

function optIP() {
  spinner.start();

  request('https://api.ipify.org?format=json', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      spinner.stop();
      return console.log('\nPublic IP ' + chalk.blue(JSON.parse(body).ip) + '\nNetwork IP ' + chalk.blue(getLocalIP()) + '\n');
    }
    spinner.stop();
    return console.log('It was not possible to retrieve your IP this time');
  });
}

module.exports = optIP;