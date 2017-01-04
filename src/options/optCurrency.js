const request = require('request');
const chalk = require('chalk');
const emoji = require('node-emoji');

function getCountryIcon(countryInitial) {
  switch (countryInitial) {
    case 'USD':
      return emoji.get('flag-us');
    case 'JPY':
      return emoji.get('flag-jp');
    case 'BGN':
      return emoji.get('flag-bg');
    case 'CZK':
      return emoji.get('flag-cz');
    case 'DKK':
      return emoji.get('flag-dk');
    case 'GBP':
      return emoji.get('flag-gb');
    case 'HUF':
      return emoji.get('flag-hu');
    case 'PLN':
      return emoji.get('flag-pl');
    case 'RON':
      return emoji.get('flag-ro');
    case 'SEK':
      return emoji.get('flag-se');
    case 'CHF':
      return emoji.get('flag-ch');
    case 'NOK':
      return emoji.get('flag-no');
    case 'HRK':
      return emoji.get('flag-hr');
    case 'RUB':
      return emoji.get('flag-ru');
    case 'TRY':
      return emoji.get('flag-tr');
    case 'AUD':
      return emoji.get('flag-au');
    case 'BRL':
      return emoji.get('flag-br');
    case 'CAD':
      return emoji.get('flag-ca');
    case 'CNY':
      return emoji.get('flag-cn');
    case 'HKD':
      return emoji.get('flag-hk');
    case 'IDR':
      return emoji.get('flag-id');
    case 'ILS':
      return emoji.get('flag-il');
    case 'INR':
      return emoji.get('flag-in');
    case 'KRW':
      return emoji.get('flag-kr');
    case 'MXN':
      return emoji.get('flag-mx');
    case 'MYR':
      return emoji.get('flag-my');
    case 'NZD':
      return emoji.get('flag-nz');
    case 'PHP':
      return emoji.get('flag-ph');
    case 'SGD':
      return emoji.get('flag-sg');
    case 'THB':
      return emoji.get('flag-th');
    case 'ZAR':
      return emoji.get('flag-za');
    case 'EUR':
    default:
      return emoji.get('euro');
  }
}

function formatRates(rates) {
  const ratesArray = [];
  Object.keys(rates).forEach((rate) => {
    ratesArray.push(`${getCountryIcon(rate)}  ${rate} ${chalk.green(rates[rate])}\n-------------\n`);
  });
  return ratesArray.join('');
}

function optCurrency(command) {
  let apiURL = 'http://api.fixer.io/latest?base=';
  if ('base' in command) {
    apiURL += `${command.base}&`;
  } else {
    apiURL += 'USD&';
  }

  if ('symbols' in command) {
    apiURL += `symbols=${command.symbols}`;
  }

  request(apiURL, (error, response, body) => {
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
    return console.log(`
${chalk.yellow('Base currency')} ${getCountryIcon(apiResponse.base)}  ${chalk.cyan(apiResponse.base)}
-------------\nCurrency Rates\n
${formatRates(apiResponse.rates)}`);
  });
}

module.exports = optCurrency;
