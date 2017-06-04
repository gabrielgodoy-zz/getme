#! /usr/bin/env node
const commander = require('commander');
const chalk = require('chalk');
const currVersion = require('../package.json').version;
const optSearch = require('./options/optSearch');
const optWeather = require('./options/optWeather');
const optIP = require('./options/optIP');
const optSpeed = require('./options/optSpeed');
const optCurrency = require('./options/optCurrency');
const optDefinition = require('./options/optDefinition');
const optTranslate = require('./options/optTranslate');
const optUpload = require('./options/optUpload');
const optQuote = require('./options/optQuote');
const optChuckNorris = require('./options/optChuckNorris');
const optTwitter = require('./options/optTwitter');
const optDate = require('./options/optDate');

commander
  .version(currVersion)
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
  .command('currency')
  .alias('cur')
  .description('Get currency rates')
  .option('-b, --base <baseCurrency>', 'Sets which base currency will be compared against the others (Default: USD)')
  .option('-s, --symbols <symbols>', 'Sets which currencies you want to compare against the base currency (Default: All currencies)')
  .action(command => optCurrency(command));

commander
  .command('definition')
  .alias('d')
  .description('Get definition of words')
  .option('-s, --synonym <word>', 'Get synonyms of a specific word')
  .action(command => optDefinition(command));

commander
  .command('translation [text...]')
  .alias('t')
  .description('Get translations for words')
  .option('-l, --list', 'List all possible language combinations of translation to insert on --fromto')
  .option('-f, --fromto <languages>', 'The translation direction. As a pair of language codes separated by a hyphen ("from"-"to"). For example, en-ru indicates translating from English to Russian.')
  .option('-t, --text [text...]', 'Insert all the text you want to translate after this flag')
  .action((textToTranslateArray, options) => optTranslate(textToTranslateArray, options));

commander
  .command('upload <filepath>')
  .alias('u')
  .description('Uploads a file and generates a link for download')
  .option('-e, --expiration <expiration>', 'Set custom time for generated link to expirate, default is 14 days')
  .action((file, options) => optUpload(file, options));

commander
  .command('ip')
  .description('Get the your public and local IP address')
  .action(command => optIP(command));

commander
  .command('quote')
  .alias('q')
  .description('Get an inspirational quote')
  .action(command => optQuote(command));

commander
  .command('speed')
  .description('Get the speed of your connection')
  .action(command => optSpeed(command));

commander
  .command('search [query...]')
  .alias('s')
  .description('Search string on Google')
  .action(query => optSearch(query));

commander
  .command('tweets [query...]')
  .alias('tw')
  .description('Search string on Twitter')
  .action(query => optTwitter(query));

commander
  .command('chuck')
  .description('Get Chuck Norris facts')
  .action(command => optChuckNorris(command));

commander
  .command('date <value>')
  .description('Add or subtract date')
  .alias('dt')
  .option('-d, --date <startDate>', 'Sets the start date (Default: Current Date)')
  .option('-p, --period <period>', 'Sets the period. Day(d), Month(M), Year(y), Week(w) (Default: d)', 'd')
  // .option('-v, --value <value>', 'Sets the value for period')
  .option('-a, --add', 'Inform to add value to date (Default Option)', true)
  .option('-s, --subtract', 'Inform to subtract value from date', false)
  .action((value, command) => optDate(value, command));

commander.on('*', (command) => {
  console.log(`The command "${chalk.red(command)}" does not exist`);
  console.log(`Please refer to the help section ${chalk.blue('getme -h')} for options`);
});

commander.parse(process.argv);
