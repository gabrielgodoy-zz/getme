import chalk from 'chalk';
import axios from 'axios';

const apiURL = 'http://api.forismatic.com/api/1.0/';
const config = { params: { method: 'getQuote', format: 'json', lang: 'en' } };

async function optQuote() {
  try {
    const response = await axios.get(apiURL, config);
    const { data, status: statusCode } = response;

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    console.log(`"${data.quoteText.trim()}", ${chalk.yellow(data.quoteAuthor)}`);
  } catch (err) {
    console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
    return err;
  }

  return false;
}

export default optQuote;
