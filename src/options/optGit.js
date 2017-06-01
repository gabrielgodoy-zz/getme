const chalk = require('chalk');
const co = require('co');
const request = require('request');
const inquirer = require('inquirer');
const childProcess = require('child_process');
const fs = require('fs');
const prompt = require('co-prompt');
const ora = require('ora');
require('babel-polyfill');

const openCmd = process.platform === 'win32' ? 'start' : 'open';
const spinner = ora({
  text: 'Loading Git notifications, can take a few seconds',
  color: 'yellow',
});

const notificationsURL = 'https://api.github.com/notifications';
const HOMEDIR = process.env[(process.platform === 'WIN32') ? 'USERPROFILE' : 'HOME'];
const gitConfig = '.git-config';

function configExists() {
  if (!fs.existsSync(`${HOMEDIR}/${gitConfig}`)) {
    return false;
  }

  if (!fs.existsSync(`${HOMEDIR}/${gitConfig}/config.json`)) {
    return false;
  }

  return fs.readFileSync(`${HOMEDIR}/${gitConfig}/config.json`);
}

function saveConfig(params) {
  const userconfig = {
    username: params.username,
    password: params.password,
  };

  if (!fs.existsSync(`${HOMEDIR}/${gitConfig}`)) {
    fs.mkdir(`${HOMEDIR}/${gitConfig}`);
    fs.writeFileSync(`${HOMEDIR}/${gitConfig}/config.json`, JSON.stringify(userconfig));
  } else {
    fs.writeFileSync(`${HOMEDIR}/${gitConfig}/config.json`, JSON.stringify(userconfig));
  }
}

function optGit() {
  co(function* () {
    if (!configExists()) {
      const username = yield prompt('GitHub Username: ');
      const password = yield prompt.password('GitHub Password: ');
      saveConfig({ username, password });
    }

    const userConfig = JSON.parse(configExists());
    spinner.start();
    const notificationsMap = {};
    const notificationsArray = [];
    const gitRequest = request.defaults({
      headers: {
        'User-Agent': 'ua',
      },
      auth: {
        username: userConfig.username,
        password: userConfig.password,
      },
    });

    gitRequest(notificationsURL, (err, resp, body) => {
      if (err) {
        console.log(`Error: ${err}`.red);
        process.exit(0);
      }

      const notifications = JSON.parse(body);

      spinner.stop();
      if (!notifications.length) {
        console.log(chalk.green('No new notifications'));
        process.exit();
      }

      for (let i = 0; i < notifications.length; i + 1) {
        const notification = notifications[i];
        notificationsArray.push(notification.subject.title);
        notificationsMap[notification.subject.title] = notification;
      }

      inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'Select notification...',
        choices: notificationsArray,
      },
      ]).then((answer) => {
        const notification = notificationsMap[answer.choice];

        console.log(`${chalk.yellow('Type :')}  ${notification.subject.type}`);
        console.log(`${chalk.yellow('Repo :')}  ${notification.repository.name}`);
        console.log(`${chalk.yellow('Title :')}  ${notification.subject.title}`);
        console.log(`${chalk.yellow('URL :')}  ${notification.repository.url}`);

        inquirer.prompt([{
          type: 'confirm',
          name: 'Open',
          message: 'Open in Browser?',
        },
        ]).then((browser) => {
          if (browser.Open) {
            setTimeout(() => {
              childProcess.exec(`${openCmd} https://www.github.com/${notification.repository.full_name}/issues`, () => {
              });
            }, 300);
          }
        });
      });
    });
  });
}

module.exports = optGit;
