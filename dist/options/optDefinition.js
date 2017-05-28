'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var request = require('request');
var chalk = require('chalk');

var wordsAPIPrefix = 'https://api.pearson.com/v2/dictionaries/ldoce5/entries?';
var KEYS = {
  KEY: 'IN8GvOkYsnN9s8tCw57H7kPS803OoY4W',
  SECRET: 'ESMU69gBujOVDQi9'
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatLogMessage(definitions) {
  definitions.forEach(function (definition) {
    var example = definition.example,
        synonymWord = definition.synonymWord,
        number = definition.number,
        def = definition.definition,
        partOfSpeech = definition.partOfSpeech;

    var logMessage = (partOfSpeech ? chalk.yellow(partOfSpeech) : '') + ' ' + def;

    console.log('------------------------');

    if (synonymWord) {
      console.log(chalk.yellow(number) + '. ' + capitalize(synonymWord));
    } else {
      logMessage = chalk.yellow(number) + '. ' + logMessage;
    }

    console.log(logMessage);

    if (example) {
      console.log(chalk.blue('Example: ') + ' ' + example);
    }
  });
}

function formatDefinitions(parsedResponse) {
  var _ref;

  var definitions = parsedResponse.results.map(function (result, index) {
    return result.senses.filter(function (sense) {
      return sense.definition;
    }).map(function (sense) {
      var definitionObject = {
        number: index + 1,
        partOfSpeech: result.part_of_speech ? '[' + result.part_of_speech + ']' : '',
        definition: '' + capitalize(sense.definition[0])
      };

      if (sense.examples) {
        definitionObject.example = '' + capitalize(sense.examples[0].text);
      }

      if (parsedResponse.url.includes('synonyms')) {
        definitionObject.synonymWord = result.headword;
      }

      return definitionObject;
    });
  });

  formatLogMessage((_ref = []).concat.apply(_ref, _toConsumableArray(definitions)));
}

function optDefinition(word) {
  var headwordOrSynonyms = word.synonym ? 'synonyms' : 'headword';
  var url = '' + wordsAPIPrefix + headwordOrSynonyms + '=' + (word.synonym ? word.synonym : word) + '&apikey=' + KEYS.KEY;

  request(url, function (error, response, body) {
    var parsedResponse = JSON.parse(body);

    if (parsedResponse.count === 0) {
      console.log(chalk.red('No matches found for that word'));
    } else {
      formatDefinitions(parsedResponse);
    }
  });
}

module.exports = optDefinition;