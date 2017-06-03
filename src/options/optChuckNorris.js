import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora({
  text: 'Waiting Chuck Norris, you have no option.',
  color: 'yellow',
});

export default async function optChuck() {
  spinner.start();

  try {
    const response = await axios.get('https://api.chucknorris.io/jokes/random');
    const { data, status: statusCode } = response;

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    spinner.stop();

    return console.log(`Chuck says: ${chalk.red(data.value)}`);
  } catch (err) {
    spinner.stop();

    console.log('Chuck is busy now, try again later.');
    return err;
  }
}

