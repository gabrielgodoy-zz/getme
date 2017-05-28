#! /usr/bin/env node
'use strict';

var commander = require('commander');
var chalk = require('chalk');
var currVersion = require('../package.json').version;
var optSearch = require('./options/optSearch');
var optWeather = require('./options/optWeather');
var optIP = require('./options/optIP');
var optSpeed = require('./options/optSpeed');
var optCurrency = require('./options/optCurrency');
var optDefinition = require('./options/optDefinition');
var optTranslate = require('./options/optTranslate');
var optUpload = require('./options/optUpload');
var optQuote = require('./options/optQuote');
var optChuckNorris = require('./options/optChuckNorris');
var optTwitter = require('./options/optTwitter');

commander.version(currVersion).command('weather').alias('w').description('Get weather').option('-c, --celsius', 'Get the weather in celsius unit (Default)').option('-f, --fahrenheit', 'Get the weather in fahrenheit unit').option('-k, --kelvin', 'Get the weather in kelvin unit').action(function (command) {
  return optWeather(command);
});

commander.command('forecast').alias('f').description('Get weather forecast of five days ahead').option('-c, --celsius', 'Get the weather in celsius unit (Default)').option('-f, --fahrenheit', 'Get the weather in fahrenheit unit').option('-k, --kelvin', 'Get the weather in kelvin unit').action(function (command) {
  return optWeather(command);
});

commander.command('currency').alias('cur').description('Get currency rates').option('-b, --base <baseCurrency>', 'Sets which base currency will be compared against the others (Default: USD)').option('-s, --symbols <symbols>', 'Sets which currencies you want to compare against the base currency (Default: All currencies)').action(function (command) {
  return optCurrency(command);
});

commander.command('definition').alias('d').description('Get definition of words').option('-s, --synonym <word>', 'Get synonyms of a specific word').action(function (command) {
  return optDefinition(command);
});

commander.command('translation [text...]').alias('t').description('Get translations for words').option('-l, --list', 'List all possible language combinations of translation to insert on --fromto').option('-f, --fromto <languages>', 'The translation direction. As a pair of language codes separated by a hyphen ("from"-"to"). For example, en-ru indicates translating from English to Russian.').option('-t, --text [text...]', 'Insert all the text you want to translate after this flag').action(function (textToTranslateArray, options) {
  return optTranslate(textToTranslateArray, options);
});

commander.command('upload <filepath>').alias('u').description('Uploads a file and generates a link for download').option('-e, --expiration <expiration>', 'Set custom time for generated link to expirate, default is 14 days').action(function (file, options) {
  return optUpload(file, options);
});

commander.command('ip').description('Get the your public and local IP address').action(function (command) {
  return optIP(command);
});

commander.command('quote').alias('q').description('Get an inspirational quote').action(function (command) {
  return optQuote(command);
});

commander.command('speed').description('Get the speed of your connection').action(function (command) {
  return optSpeed(command);
});

commander.command('search [query...]').alias('s').description('Search string on Google').action(function (query) {
  return optSearch(query);
});

commander.command('tweets [query...]').alias('t').description('Search string on Twitter').action(function (query) {
  return optTwitter(query);
});

commander.command('chuck').description('Get Chuck Norris facts').action(function (command) {
  return optChuckNorris(command);
});

commander.on('*', function (command) {
  console.log('The command "' + chalk.red(command) + '" does not exist');
  console.log('Please refer to the help section ' + chalk.blue('getme -h') + ' for options');
});

commander.parse(process.argv);