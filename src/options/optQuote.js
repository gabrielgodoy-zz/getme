const chalk = require('chalk');
const request = require('request');

const apiPrefix = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';

function optQuote() {
  request.get(apiPrefix, (error, response, body) => {
    const parsedResponse = JSON.parse(body);
    console.log(`"${parsedResponse.quoteText.trim()}", ${chalk.yellow(parsedResponse.quoteAuthor)}`);
  });
}

module.exports = optQuote;
