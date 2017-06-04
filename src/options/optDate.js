const chalk = require('chalk');
const moment = require('moment/min/moment-with-locales');

function optDate(value, data) {
  const date = moment(data.date);
  const lang = 'pt';
  const originalDate = date.format('YYYY-MM-DD');
  moment.locale(lang);
  const period = data.period || 'd';

  let newDate;
  if (data.subtract) {
    newDate = date.subtract(value, period);
  } else {
    newDate = date.add(value, period);
  }
  const formatedDate = newDate.format('(ddd) YYYY-MM-DD');
  console.log(`\nInformed date: ${originalDate}`);
  return console.log(`Calculated Date: ${chalk.yellow(formatedDate)}`);
}

module.exports = optDate;
