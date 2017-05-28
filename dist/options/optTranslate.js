'use strict';

var chalk = require('chalk');
var ora = require('ora');
var request = require('request');

var key = 'trnsl.1.1.20170105T060308Z.f3f9bcb6f1acfc21.b8b98c7a8899c9532a26b8c0a665696bd9b6aa83';
var languageCode = 'pt';

var spinner = ora({
  text: 'Loading translation',
  color: 'yellow'
});

function formatFromtoCombinations(combinations) {
  var formattedGroupsOfTen = [];
  var dirsGroup = [];
  combinations.forEach(function (fromto, index, array) {
    var isDivisibleByTen = index % 10 === 0;
    var groupsOfTenInArray = Math.ceil(array.length / 10);

    if (isDivisibleByTen && groupsOfTenInArray > formattedGroupsOfTen.length) {
      formattedGroupsOfTen.push(dirsGroup.join(' | '));
      dirsGroup = [];
    }
    dirsGroup.push(fromto);

    var isFinalItemInArray = index === array.length - 1;
    var groupsOfTenFinished = groupsOfTenInArray === formattedGroupsOfTen.length;
    if (groupsOfTenFinished && isFinalItemInArray) {
      formattedGroupsOfTen.push(dirsGroup.join(' | '));
    }
  });
  return formattedGroupsOfTen.join('\n');
}

function optTranslate(textToTranslateArray, options) {
  if (options.list) {
    var listLangsPrefix = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
    var listSupportedLangs = listLangsPrefix + '?key=' + key + '&ui=' + languageCode;
    request.get(listSupportedLangs, function (error, response, body) {
      var parsedResponse = JSON.parse(body);
      console.log('\n' + chalk.yellow('--fromto') + ' options');
      console.log(formatFromtoCombinations(parsedResponse.dirs));
    });
  } else if (options.fromto && options.text) {
    spinner.start();
    var translatePrefix = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
    var fromto = options.fromto;
    var text = '' + options.text + (textToTranslateArray.length ? '+' + textToTranslateArray.join('+') : '');
    var apiTranslate = translatePrefix + '?key=' + key + '&text=' + text + '&lang=' + fromto + '&options=1';
    request.get(apiTranslate, function (error, response, body) {
      spinner.stop();
      var parsedResponse = JSON.parse(body);
      console.log(text.replace(/\+/g, ' '));
      console.log(chalk.blue(parsedResponse.text[0]));
    });
  } else {
    console.log('\nIn order to translate a text you need to pass ' + chalk.yellow('--fromto') + ' and ' + chalk.yellow('--text') + ' arguments');
    console.log('Example: ' + chalk.blue('getme translation --fromto en-es --text The book is on the table'));
  }
}

module.exports = optTranslate;