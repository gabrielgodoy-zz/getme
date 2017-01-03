#! /usr/bin/env node
const commander = require('commander');
const optSearch = require('./options/optSearch');

commander.option('-s, --search', 'Search string on Google')
  .parse(process.argv);

switch (true) {
  case (commander.search): {
    optSearch(commander);
  }
    break;
  default: {
    console.log('No option found');
  }
}
