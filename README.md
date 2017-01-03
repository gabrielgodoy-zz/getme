## Getme
CLI to search things on Google, it automatically opens the browser with the search query for you.

[![npm](https://img.shields.io/npm/v/getme.svg)](https://www.npmjs.com/package/getme)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/gabrielgodoy/getme/total.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/gabrielgodoy/getme/badge.svg?branch=master)](https://coveralls.io/github/gabrielgodoy/getme?branch=master)

Install it globally:

`npm i getme -g`

### Options

- `-h, --help`    Output usage information
- `-s, --search`  Search in Google
- `-w, weather [unit]`  Get the weather, default unit is Celsius, can be **celsius, fahrenheit, or kelvin**
- `-f, forecast [unit]`  Get the weather forecast of 5 days ahead, default unit is Celsius
- `-ip, ip` Get your public and network IP addresses

### Examples of Usage

`getme -s something to search on Google`

`getme weather`

`getme forecast`

`getme ip`

### Different usage for `weather` and `forecast`

- `getme weather` or `getme -w` for Celsius
- `getme weather f` or `getme -w f` for Fahrenheit

- `getme forecast` or `getme -f` for Celsius 
- `getme forecast f` or `getme -f f` for Fahrenheit
