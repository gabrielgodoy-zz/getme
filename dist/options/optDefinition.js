'use strict';

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
    if (definition.example) {
      if (definition.synonymWord) {
        console.log('------------------------\n' + chalk.yellow(definition.number) + '. ' + capitalize(definition.synonymWord) + '\n' + (definition.partOfSpeech ? chalk.yellow(definition.partOfSpeech) : '') + ' ' + definition.definition + '\n' + chalk.blue('Example: ') + ' ' + definition.example);
      } else {
        console.log('------------------------\n' + chalk.yellow(definition.number) + '. ' + chalk.yellow(definition.partOfSpeech) + ' ' + definition.definition + '\n' + chalk.blue('Example: ') + ' ' + definition.example);
      }
    } else if (definition.synonymWord) {
      console.log('------------------------\n' + chalk.yellow(definition.number) + '. ' + capitalize(definition.synonymWord) + '\n' + (definition.partOfSpeech ? chalk.yellow(definition.partOfSpeech) : '') + ' ' + definition.definition);
    } else {
      console.log('------------------------\n' + chalk.yellow(definition.number) + '. ' + (definition.partOfSpeech ? chalk.yellow(definition.partOfSpeech) : '') + ' ' + definition.definition);
    }
  });
}

function formatDefinitions(parsedResponse) {
  var definitions = [];
  parsedResponse.results.forEach(function (result, index) {
    result.senses.forEach(function (sense) {
      if ('definition' in sense) {
        if ('examples' in sense) {
          var definitionObject = {
            number: '' + (index + 1),
            definition: '' + capitalize(sense.definition[0]),
            partOfSpeech: result.part_of_speech ? '[' + result.part_of_speech + ']' : '',
            example: '' + capitalize(sense.examples[0].text)
          };
          if (parsedResponse.url.indexOf('synonyms') > -1) {
            definitionObject.synonymWord = result.headword;
          }
          definitions.push(definitionObject);
        } else {
          var _definitionObject = {
            number: '' + (index + 1),
            partOfSpeech: result.part_of_speech ? '[' + result.part_of_speech + ']' : '',
            definition: '' + capitalize(sense.definition[0])
          };
          if (parsedResponse.url.indexOf('synonyms') > -1) {
            _definitionObject.synonymWord = result.headword;
          }
          definitions.push(_definitionObject);
        }
      }
    });
  });
  formatLogMessage(definitions);
}

function optDefinition(word) {
  var headwordOrSynonyms = word.synonym ? 'synonyms' : 'headword';
  request('' + wordsAPIPrefix + headwordOrSynonyms + '=' + (word.synonym ? word.synonym : word) + '&apikey=' + KEYS.KEY, function (error, response, body) {
    var parsedResponse = JSON.parse(body);
    if (parsedResponse.count === 0) {
      console.log(chalk.red('No matches found for that word'));
    } else {
      formatDefinitions(parsedResponse);
    }
  });
}

module.exports = optDefinition;