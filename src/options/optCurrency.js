import axios from 'axios';
import chalk from 'chalk';
import emoji from 'node-emoji';

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
  return Object
    .keys(rates)
    .map(rate => `${getCountryIcon(rate)}  ${rate} ${chalk.green(rates[rate])}\n-------------\n`)
    .join('');
}

async function optCurrency({ base = 'USD', symbols } = {}) {
  const apiURL = 'http://api.fixer.io/latest';
  const params = { params: { base } };

  if (symbols) {
    params.params.symbols = symbols;
  }

  try {
    const response = await axios.get(apiURL, params);
    const { data, status: statusCode } = response;

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    console.log(`\n${chalk.yellow('Base currency')} ${getCountryIcon(data.base)}  ${chalk.cyan(data.base)}`);
    console.log(`\nCurrency Rates\n\n${formatRates(data.rates)}`);
  } catch (err) {
    console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
    return err;
  }

  return false;
}

module.exports = optCurrency;
