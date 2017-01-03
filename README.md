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

- `-w, weather [unit]`  Get the weather, default unit is Celsius, can be **c, f, or k**
  - Example `getme weather f` for fahrenheit, or simply `getme weather` to get Celsius
  
- `-f, forecast [unit]`  Get the weather forecast of 5 days ahead, default unit is Celsius
  - Example `getme forecast f` for fahrenheit, or simply `getme forecast` to get Celsius 


### Usage

`getme -s jobs`

`getme weather`

`getme forecast`

`getme ip`

Browser opens with search query `jobs`
