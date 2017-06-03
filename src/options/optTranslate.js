import chalk from 'chalk';
import ora from 'ora';
import axios from 'axios';

const key = 'trnsl.1.1.20170105T060308Z.f3f9bcb6f1acfc21.b8b98c7a8899c9532a26b8c0a665696bd9b6aa83';
const languageCode = 'pt';

const spinner = ora({
  text: 'Loading translation',
  color: 'yellow',
});

function formatFromtoCombinations(combinations) {
  const lines = [];

  for (let i = 0, n = combinations.length; i < n; i += 10) {
    lines.push(combinations.slice(i, i + 10).join(' | '));
  }

  return lines.join('\n');
}

async function optTranslate(textToTranslateArray, options) {
  if (options.list) {
    const url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
    const params = { key, ui: languageCode };

    try {
      const { data, status: statusCode } = await axios.get(url, { params });

      if (statusCode !== 200 || typeof data !== 'object') {
        console.log(chalk.red('It was not possible to retrieve what you want'));
        return false;
      }

      console.log(`\n${chalk.yellow('--fromto')} options`);
      console.log(formatFromtoCombinations(data.dirs));
    } catch (err) {
      console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
      return err;
    }
  } else if (options.fromto && options.text) {
    spinner.start();

    const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
    const fromto = options.fromto;
    const text = `${options.text}+${(textToTranslateArray.length ? textToTranslateArray.join('+') : '')}`;
    const params = { key, text, lang: fromto, options: 1 };

    try {
      const { data, status: statusCode } = await axios.get(url, { params });

      spinner.stop();

      if (statusCode !== 200 || typeof data !== 'object') {
        console.log(chalk.red('It was not possible to retrieve what you want'));
        return false;
      }

      console.log(text.replace(/\+/g, ' '));
      console.log(chalk.blue(data.text[0]));
    } catch (err) {
      spinner.stop();
      console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
      return err;
    }
  } else {
    console.log(`\nIn order to translate a text you need to pass ${chalk.yellow('--fromto')} and ${chalk.yellow('--text')} arguments`);
    console.log(`Example: ${chalk.blue('getme translation --fromto en-es --text The book is on the table')}`);
  }

  return true;
}

export default optTranslate;
