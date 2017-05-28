'use strict';

var chalk = require('chalk');
var childProcess = require('child_process');

function optSearch(query) {
  var queryGoogle = 'https://www.google.com/search?q=';
  var searchQuery = query.join('+');
  var searchAddress = queryGoogle + searchQuery;
  var openCmd = process.platform === 'win32' ? 'start' : 'open';

  console.log(chalk.blue('Searching for "' + query.join(' ') + '" on Google'));
  setTimeout(function () {
    childProcess.exec(openCmd + ' ' + searchAddress, function () {});
  }, 300);
}

module.exports = optSearch;