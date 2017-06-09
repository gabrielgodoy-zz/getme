const chalk = require('chalk');
const moment = require('moment/min/moment-with-locales');

function calculateDate(date, period, value, subtract) {
  const dt = moment(date);
  if (subtract) {
    dt.subtract(value, period);
  } else {
    dt.add(value, period);
  }
  return dt;
}

function optDate(value, data) {
  const formatString = '(ddd) YYYY-MM-DD';
  const period = data.period || 'd';
  const date = moment(data.date);
  const newDate = calculateDate(date, period, value, data.subtract);
  const sDate = date.format(formatString);
  const sNewDate = newDate.format(formatString);
  console.log(`\nInformed date: ${chalk.yellow(sDate)}`);
  return console.log(`Calculated Date: ${chalk.yellow(sNewDate)}`);
}

module.exports = optDate;
