// const request = require('request');
// const chalk = require('chalk');
const ora = require('ora');

const spinner = ora({
  text: 'Calculating Date',
  color: 'yellow',
});

/*
-u = Unity (d, m, y) (default: d)
-v = Value (Int)
-d = Start Date (default: now) //MASK YYYY-MM-DD
-f = Date Format (default: YYYY-MM-DD)
--subtract = Subtract from date
--add = Add to date (Default Option)

getme date -u m -v 10  // Add 10 months to current date
getme date -u --subtract -v 3 // Subtract 3 days from today
getme date -u d -v 7 -d 2017-05-10 --add // Add 7 days to specified date

*/

function optDate() {
  setTimeout(() => {
    spinner.stop();
  }, 2000);
}

module.exports = optDate;
