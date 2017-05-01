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
    const { example, synonymWord, number, definition: def, partOfSpeech } = definition;
    let logMessage = `${partOfSpeech ? chalk.yellow(partOfSpeech) : ''} ${def}`;

    console.log('------------------------');

    if (synonymWord) {
      console.log(`${chalk.yellow(number)}. ${capitalize(synonymWord)}`);
    } else {
      logMessage = `${chalk.yellow(number)}. ${logMessage}`;
    }

    console.log(logMessage);

    if (example) {
      console.log(`${chalk.blue('Example: ')} ${example}`);
    }
  });
}

function formatDefinitions(parsedResponse) {
  const definitions = parsedResponse.results
    .map((result, index) => result.senses
    .filter(sense => sense.definition)
    .map((sense) => {
      const definitionObject = {
        number: index + 1,
        partOfSpeech: result.part_of_speech ? `[${result.part_of_speech}]` : '',
        definition: `${capitalize(sense.definition[0])}`,
      };

      if (sense.examples) {
        definitionObject.example = `${capitalize(sense.examples[0].text)}`;
      }

      if (parsedResponse.url.includes('synonyms')) {
        definitionObject.synonymWord = result.headword;
      }

      return definitionObject;
    }));

  formatLogMessage([].concat(...definitions));
}

function optDefinition(word) {
  const headwordOrSynonyms = word.synonym ? 'synonyms' : 'headword';
  const url = `${wordsAPIPrefix}${headwordOrSynonyms}=${word.synonym ? word.synonym : word}&apikey=${KEYS.KEY}`;

  request(url, (error, response, body) => {
    const parsedResponse = JSON.parse(body);

    if (parsedResponse.count === 0) {
      console.log(chalk.red('No matches found for that word'));
    } else {
      formatDefinitions(parsedResponse);
    }
  });
}

export default optDefinition;
