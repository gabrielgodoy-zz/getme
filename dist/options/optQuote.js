'use strict';

var chalk = require('chalk');
var request = require('request');

var apiPrefix = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';

function optQuote() {
  request.get(apiPrefix, function (error, response, body) {
    var parsedResponse = JSON.parse(body);
    console.log('"' + parsedResponse.quoteText.trim() + '", ' + chalk.yellow(parsedResponse.quoteAuthor));
  });
}

module.exports = optQuote;