#! /usr/bin/env node
const commander = require('commander');
const optSearch = require('./options/optSearch');
const optWeather = require('./options/optWeather');
const optIP = require('./options/optIP');
const optSpeed = require('./options/optSpeed');
const optCurrency = require('./options/optCurrency');
const optDefinition = require('./options/optDefinition');
const optTranslate = require('./options/optTranslate');

commander
  .version('1.2.9')
  .command('weather')
  .alias('w')
  .description('Get weather')
  .option('-c, --celsius', 'Get the weather in celsius unit (Default)')
  .option('-f, --fahrenheit', 'Get the weather in fahrenheit unit')
  .option('-k, --kelvin', 'Get the weather in kelvin unit')
  .action(command => optWeather(command));

commander
  .command('forecast')
  .alias('f')
  .description('Get weather forecast of five days ahead')
  .option('-c, --celsius', 'Get the weather in celsius unit (Default)')
  .option('-f, --fahrenheit', 'Get the weather in fahrenheit unit')
  .option('-k, --kelvin', 'Get the weather in kelvin unit')
  .action(command => optWeather(command));

commander
  .command('translation')
  .alias('t')
  .option('-l, --list', 'List all possible language combinations of translation to insert on --fromto')
  .option('-ft, --fromto <languages>', 'The translation direction. As a pair of language codes separated by a hyphen ("from"-"to"). For example, en-ru indicates translating from English to Russian.')
  .option('-t, --text [text...]', 'Insert all the text you want to translate after this flag')
  .description('Get translations for words')
  .action(command => optTranslate(command));

commander
  .command('currency')
  .alias('cur')
  .description('Get currency rates')
  .option('-b, --base <baseCurrency>', 'Sets which base currency will be compared against the others (Default: USD)')
  .option('-s, --symbols <symbols>', 'Sets which currencies you want to compare against the base currency (Default: All currencies)')
  .action(command => optCurrency(command));

commander
  .command('definition')
  .alias('d')
  .option('-s, --synonym <word>', 'Get synonyms of a specific word')
  .description('Get definition of words')
  .action(command => optDefinition(command));

commander
  .command('ip')
  .description('Get the your public and local IP address')
  .action(command => optIP(command));

commander
  .command('speed')
  .description('Get the speed of your connection')
  .action(command => optSpeed(command));

commander
  .command('search [query...]')
  .alias('s')
  .description('Search string on Google')
  .action(query => optSearch(query));

commander.parse(process.argv);
