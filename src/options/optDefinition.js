const request = require('request');
const chalk = require('chalk');

const wordsAPIPrefix = 'https://api.pearson.com/v2/dictionaries/ldoce5/entries?';
const KEYS = {
  KEY: 'IN8GvOkYsnN9s8tCw57H7kPS803OoY4W',
  SECRET: 'ESMU69gBujOVDQi9',
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatLogMessage(definitions) {
  definitions.forEach((definition) => {
    if (definition.example) {
      if (definition.synonymWord) {
        console.log(`------------------------
${chalk.yellow(definition.number)}. ${capitalize(definition.synonymWord)}
${definition.definition}
${chalk.blue('Example: ')} ${definition.example}`);
      } else {
        console.log(`------------------------
${chalk.yellow(definition.number)}. ${definition.definition}
${chalk.blue('Example: ')} ${definition.example}`);
      }
    } else if (definition.synonymWord) {
      console.log(`------------------------
${chalk.yellow(definition.number)}. ${capitalize(definition.synonymWord)}
${definition.definition}`);
    } else {
      console.log(`------------------------
${chalk.yellow(definition.number)}. ${definition.definition}`);
    }
  });
}

function formatDefinitions(parsedResponse) {
  const definitions = [];
  parsedResponse.results.forEach((result, index) => {
    result.senses.forEach((sense) => {
      if ('definition' in sense) {
        if ('examples' in sense) {
          const definitionObject = {
            number: `${index + 1}`,
            definition: `${capitalize(sense.definition[0])}`,
            example: `${capitalize(sense.examples[0].text)}`,
          };
          if (parsedResponse.url.indexOf('synonyms') > -1) {
            definitionObject.synonymWord = result.headword;
          }
          definitions.push(definitionObject);
        } else {
          const definitionObject = {
            number: `${index + 1}`,
            definition: `${capitalize(sense.definition[0])}`,
          };
          if (parsedResponse.url.indexOf('synonyms') > -1) {
            definitionObject.synonymWord = result.headword;
          }
          definitions.push(definitionObject);
        }
      }
    });
  });
  formatLogMessage(definitions);
}

function optDefinition(word) {
  const headwordOrSynonyms = word.synonym ? 'synonyms' : 'headword';
  request(`${wordsAPIPrefix}${headwordOrSynonyms}=${word.synonym ? word.synonym : word}&apikey=${KEYS.KEY}`, (error, response, body) => {
    const parsedResponse = JSON.parse(body);
    if (parsedResponse.count === 0) {
      console.log(chalk.red('No matches found for that word'));
    } else {
      formatDefinitions(parsedResponse);
    }
  });
}

module.exports = optDefinition;
