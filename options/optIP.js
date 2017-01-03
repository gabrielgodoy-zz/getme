const request = require('request');
const chalk = require('chalk');
const os = require('os');

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
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(`Public IP ${chalk.blue(JSON.parse(body).ip)}\nNetwork IP ${chalk.blue(getLocalIP())}`);
    }
    return 'It was not possible to retrieve your IP this time';
  });
}

module.exports = optIP;
