'use strict';

var chalk = require('chalk');
var request = require('request');
var fs = require('fs');
var ora = require('ora');

var spinner = ora({
  text: 'Uploading your file, can take a few seconds',
  color: 'yellow'
});

function handlerError(errCode) {
  switch (errCode) {
    case 'ENOENT':
      return 'No such file or directory';
    case 'EISDIR':
      return 'Illegal operation on a directory';
    default:
      return 'Some error occurred, try again.';
  }
}

function optUpload(file, options) {
  spinner.start();
  var expiration = options.expiration || '';
  var req = request.post('https://file.io?expires=' + expiration, function (err, resp, body) {
    spinner.stop();
    if (err) {
      console.log(chalk.red(handlerError(err.code)));
      console.log('Also file must be less than 5gb of size');
    } else {
      var responseBody = JSON.parse(body);
      console.log('' + chalk.green(responseBody.link));
      console.log('This file expires in ' + chalk.yellow(responseBody.expiry));
    }
  });

  var form = req.form();
  form.append('file', fs.createReadStream(file));
}

module.exports = optUpload;