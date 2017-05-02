const request = require('request');
const chalk = require('chalk');
const ora = require('ora');
const os = require('os');

const spinner = ora({
  text: 'Loading IPs',
  color: 'yellow',
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  Object.keys(interfaces).forEach((netInterface) => {
    interfaces[netInterface].forEach((interfaceObject) => {
      if (interfaceObject.family === 'IPv4' && !interfaceObject.internal) {
        addresses.push(interfaceObject.address);
      }
    });
  });
  return addresses;
}

function optIP() {
  spinner.start();

  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      spinner.stop();
      return console.log(`\nPublic IP ${chalk.blue(JSON.parse(body).ip)}\nNetwork IP ${chalk.blue(getLocalIP())}`);
    }
    spinner.stop();
    return console.log('It was not possible to retrieve your IP this time');
  });
}

module.exports = optIP;

