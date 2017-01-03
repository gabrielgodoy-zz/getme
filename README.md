## Getme
CLI utility for everyday tasks

With `getme` you can get weather, forecast, IP address, internet speed, or make google searches. 

✨ All from the terminal ✨ 

[![NPM](https://nodei.co/npm/getme.png?downloads=true)](https://nodei.co/npm/getme/)

[![npm](https://img.shields.io/npm/v/getme.svg)](https://www.npmjs.com/package/getme)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/gabrielgodoy/getme/total.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/gabrielgodoy/getme/badge.svg?branch=master)](https://coveralls.io/github/gabrielgodoy/getme?branch=master)

Install it globally:

`npm i getme -g`

![Demo](demo.gif)

### Getme Options

- `-h, --help`  Output usage information
- `-s, --search`  Search in Google
- `w, weather [unit]`  Get weather, default unit is Celsius, can be **celsius, fahrenheit, or kelvin**
- `f, forecast [unit]`  Get weather forecast of 5 days ahead, default unit is Celsius
- `ip`  Get public and network IP addresses
- `speed`  Get internet speed based on [speedtest](http://www.speedtest.net/)

### Examples of Usage

`getme -s something to search on Google`

`getme weather`

`getme forecast`

`getme ip`

`getme speed`

### Different usage for `weather` and `forecast`

- `getme weather`  or  `getme w`  for weather in Celsius (default)
- `getme weather f`  or  `getme w f`  for Fahrenheit

- `getme forecast`  or  `getme f` for forecast in Celsius (default) 
- `getme forecast f`  or  `getme f f` for forecast in Fahrenheit
