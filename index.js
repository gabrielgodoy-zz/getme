#! /usr/bin/env node

const userArgs = process.argv.slice(2),
	exec = require('child_process').exec, // spawns a shell and runs a command within that shell
	chalk = require('chalk'),
	queryGoogle = 'https://www.google.com/search?q=';

let searchPattern = userArgs.join('+'),
	searchAddress = queryGoogle + searchPattern;

if (searchPattern) {
	exec('open ' + searchAddress, function(err, stdout, stderr) {
		if (stderr) {
			console.log(chalk.red(`An error ocurred ${stderr}`));
		} else {
			console.log(chalk.blue(`Searching for ${searchPattern} in Google`));
		}
	});
} else {
	console.log(chalk.yellow(`Say what you want to search for!`));
}
