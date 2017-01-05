#! /usr/bin/env node
'use strict';

var commander = require('commander');
var chalk = require('chalk');
var optSearch = require('./options/optSearch');
var optWeather = require('./options/optWeather');
var optIP = require('./options/optIP');
var optSpeed = require('./options/optSpeed');
var optCurrency = require('./options/optCurrency');
var optDefinition = require('./options/optDefinition');

commander.version('1.2.9').command('weather').alias('w').description('Get weather').option('-c, --celsius', 'Get the weather in celsius unit (Default)').option('-f, --fahrenheit', 'Get the weather in fahrenheit unit').option('-k, --kelvin', 'Get the weather in kelvin unit').action(function (command) {
  return optWeather(command);
});

commander.command('forecast').alias('f').description('Get weather forecast of five days ahead').option('-c, --celsius', 'Get the weather in celsius unit (Default)').option('-f, --fahrenheit', 'Get the weather in fahrenheit unit').option('-k, --kelvin', 'Get the weather in kelvin unit').action(function (command) {
  return optWeather(command);
});

commander.command('currency').alias('cur').description('Get currency rates').option('-b, --base <baseCurrency>', 'Sets which base currency will be compared against the others (Default: USD)').option('-s, --symbols <symbols>', 'Sets which currencies you want to compare against the base currency (Default: All currencies)').action(function (command) {
  return optCurrency(command);
});

commander.command('definition').alias('d').option('-s, --synonym <word>', 'Get synonyms of a specific word').description('Get definition of words').action(function (command) {
  return optDefinition(command);
});

commander.command('ip').description('Get the your public and local IP address').action(function (command) {
  return optIP(command);
});

commander.command('speed').description('Get the speed of your connection').action(function (command) {
  return optSpeed(command);
});

commander.command('search [query...]').alias('s').description('Search string on Google').action(function (query) {
  return optSearch(query);
});

commander.on('*', function (command) {
  console.log('\nThe command "' + chalk.red(command) + '" does not exist\nPlease refer to the help section ' + chalk.blue('getme -h') + ' for options\n  ');
});

// console.log(commander);

commander.parse(process.argv);