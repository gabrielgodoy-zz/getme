## Getme
CLI utility to get weather forecast, IP address or to make google searches from the terminal.

[![npm](https://img.shields.io/npm/v/getme.svg)](https://www.npmjs.com/package/getme)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/gabrielgodoy/getme/total.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/gabrielgodoy/getme/badge.svg?branch=master)](https://coveralls.io/github/gabrielgodoy/getme?branch=master)

Install it globally:

`npm i getme -g`

### Options

- `-h, --help`  Output usage information
- `-s, --search`  Search in Google
- `w, weather [unit]`  Get the weather, default unit is Celsius, can be **celsius, fahrenheit, or kelvin**
- `f, forecast [unit]`  Get the weather forecast of 5 days ahead, default unit is Celsius
- `ip`  Get your public and network IP addresses

### Examples of Usage

`getme -s something to search on Google`

`getme ip`

`getme weather`

`getme forecast`

### Different usage for `weather` and `forecast`

- `getme weather`  or  `getme w`  for weather in Celsius (default)
- `getme weather f`  or  `getme w f`  for Fahrenheit

- `getme forecast`  or  `getme f` for forecast in Celsius (default) 
- `getme forecast f`  or  `getme f f` for forecast in Fahrenheit
