const chalk = require('chalk');
const ora = require('ora');
const request = require('request');

const key = 'trnsl.1.1.20170105T060308Z.f3f9bcb6f1acfc21.b8b98c7a8899c9532a26b8c0a665696bd9b6aa83';
const languageCode = 'pt';

const spinner = ora({
  text: 'Loading translation',
  color: 'yellow',
});

function formatFromtoCombinations(combinations) {
  const formattedGroupsOfTen = [];
  let dirsGroup = [];
  combinations.forEach((fromto, index, array) => {
    const isDivisibleByTen = index % 10 === 0;
    const groupsOfTenInArray = Math.ceil(array.length / 10);

    if (isDivisibleByTen && groupsOfTenInArray > formattedGroupsOfTen.length) {
      formattedGroupsOfTen.push(dirsGroup.join(' | '));
      dirsGroup = [];
    }
    dirsGroup.push(fromto);

    const isFinalItemInArray = index === (array.length - 1);
    const groupsOfTenFinished = groupsOfTenInArray === formattedGroupsOfTen.length;
    if (groupsOfTenFinished && isFinalItemInArray) {
      formattedGroupsOfTen.push(dirsGroup.join(' | '));
    }
  });
  return formattedGroupsOfTen.join('\n');
}

function optTranslate(textToTranslateArray, options) {
  if (options.list) {
    const listLangsPrefix = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
    const listSupportedLangs = `${listLangsPrefix}?key=${key}&ui=${languageCode}`;
    request.get(listSupportedLangs, (error, response, body) => {
      const parsedResponse = JSON.parse(body);
      console.log(`\n${chalk.yellow('--fromto')} options`);
      console.log(formatFromtoCombinations(parsedResponse.dirs));
    });
  } else if (options.fromto && options.text) {
    spinner.start();
    const translatePrefix = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
    const fromto = options.fromto;
    const text = `${options.text}${textToTranslateArray.length ? `+${textToTranslateArray.join('+')}` : ''}`;
    const apiTranslate = `${translatePrefix}?key=${key}&text=${text}&lang=${fromto}&options=1`;
    request.get(apiTranslate, (error, response, body) => {
      spinner.stop();
      const parsedResponse = JSON.parse(body);
      console.log(text.replace(/\+/g, ' '));
      console.log(chalk.blue(parsedResponse.text[0]));
    });
  } else {
    console.log(`\nIn order to translate a text you need to pass ${chalk.yellow('--fromto')} and ${chalk.yellow('--text')} arguments`);
    console.log(`Example: ${chalk.blue('getme translation --fromto en-es --text The book is on the table')}`);
  }
}

export default optTranslate;
