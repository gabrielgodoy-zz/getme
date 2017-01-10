const request = require('request');
const chalk = require('chalk');
const emoji = require('node-emoji');

const emojis = {
  USD: 'flag-us',
  JPY: 'flag-jp',
  BGN: 'flag-bg',
  CZK: 'flag-cz',
  DKK: 'flag-dk',
  GBP: 'flag-gb',
  HUF: 'flag-hu',
  PLN: 'flag-pl',
  RON: 'flag-ro',
  SEK: 'flag-se',
  CHF: 'flag-ch',
  NOK: 'flag-no',
  HRK: 'flag-hr',
  RUB: 'flag-ru',
  TRY: 'flag-tr',
  AUD: 'flag-au',
  BRL: 'flag-br',
  CAD: 'flag-ca',
  CNY: 'flag-cn',
  HKD: 'flag-hk',
  IDR: 'flag-id',
  ILS: 'flag-il',
  INR: 'flag-in',
  KRW: 'flag-kr',
  MXN: 'flag-mx',
  MYR: 'flag-my',
  NZD: 'flag-nz',
  PHP: 'flag-ph',
  SGD: 'flag-sg',
  THB: 'flag-th',
  ZAR: 'flag-za',
  EUR: 'euro',
};

function getCountryIcon(countryInitial) {
  return emoji.get(emojis[countryInitial]);
}

function formatRates(rates) {
  return Object.keys(rates)
          .map(rate => `${getCountryIcon(rate)}  ${rate} ${chalk.green(rates[rate])}\n-------------\n`)
          .join('');
}

function optCurrency({ base = 'USD', symbols } = {}) {
  let apiURL = 'http://api.fixer.io/latest?base=';

  apiURL += `${base}&`;

  if (symbols) {
    apiURL += `symbols=${symbols}`;
  }

  request(apiURL, (error, response, body) => { // eslint-disable-line consistent-return
    let apiResponse;

    try {
      apiResponse = JSON.parse(body);
    } catch (parseError) {
      console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
      return parseError;
    }

    if ('error' in apiResponse) {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }
    
    console.log(`\n${chalk.yellow('Base currency')} ${getCountryIcon(apiResponse.base)}  ${chalk.cyan(apiResponse.base)}`);
    console.log(`\nCurrency Rates\n\n${formatRates(apiResponse.rates)}`);
  });
}

module.exports = optCurrency;
