#! /usr/bin/env node
const commander = require('commander');
const optSearch = require('./options/optSearch');
const optWeather = require('./options/optWeather');
const optIP = require('./options/optIP');
const optSpeed = require('./options/optSpeed');

commander
  .version('1.2.1')
  .option('-s, --search', 'Search string on Google')
  .option('w, weather [unit]', 'Get the weather on you region')
  .option('f, forecast [unit]', 'Get the forecast on you region')
  .option('ip', 'Get the your public and local IP address')
  .option('speed', 'Get the speed of your connection')
  .parse(process.argv);

switch (true) {
  case ('search' in commander): {
    optSearch(commander);
  }
    break;
  case ('weather' in commander):
  case ('forecast' in commander): {
    optWeather(commander);
  }
    break;
  case ('ip' in commander): {
    optIP(commander);
  }
    break;
  case ('speed' in commander): {
    optSpeed(commander);
  }
    break;
  default: {
    console.log('No option found');
  }
}
