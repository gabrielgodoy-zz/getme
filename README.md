## getme
CLI utility for everyday tasks

With `getme` you can get weather, forecast, currency rate, IP address, internet speed, or make google searches. 

✨ All from the terminal ✨ 

[![NPM](https://nodei.co/npm/getme.png?downloads=true)](https://nodei.co/npm/getme/)

[![npm](https://img.shields.io/npm/v/getme.svg)](https://www.npmjs.com/package/getme)
[![Travis](https://img.shields.io/travis/gabrielgodoy/getme.svg)]()
[![npm](https://img.shields.io/npm/dm/getme.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/gabrielgodoy/getme/badge.svg?branch=master)](https://coveralls.io/github/gabrielgodoy/getme?branch=master)

Install it globally 

`npm i getme -g`

![Demo](demo.gif)

### Getme Options

| command                               | definition                                                                                                      |
| --------------------------------------| :---------------------------------------------------------------------------------------------------------------|
| ℹ️ `-h, --help`                        | Output usage information                                                                                        |
| 🔎 `s, search [query]`                 | Search in Google                                                                                               |
| ☀️ `w, weather [unit]`                 | Get weather, default unit is Celsius, can be **celsius, fahrenheit, or kelvin**                                |
| 🗓 `f, forecast [unit]`                | Get weather forecast of 5 days ahead, default unit is Celsius                                                  |
| 💰 `cur, currency [base] [currs]`      | Get currency rates against a base currency (default base USD, default currencies All)                          |
| 🌎 `ip`                                | Get public and network IP addresses                                                                            |
| ⚡ `speed`                             | Get internet speed based on [speedtest](http://www.speedtest.net/)                                             |


### Examples of usage

`getme search dogs and cats` Opens browser, searching for "dogs and cats"

`getme currency -s JPY,BRL,CAD` Get JPY, BRL and CAD currencies where base currency is USD (USD is default)

`getme currency -b EUR -s USD,BRL` Get USD and BRL currency where base currency is EUR

`getme weather` Weather in celsius

`getme weather -f` Weather in fahrenheit

`getme forecast` Forecast in celsius

`getme forecast -f` Forecast in fahrenheit

`getme ip`

`getme speed`


### Currency options

Most common base currencies to be passed as parameter:
- USD (Dollar) Default
- EUR (Euro)

For entire list of possible currency initials: 
[European Central Bank](http://www.ecb.europa.eu/stats/exchange/eurofxref/html/index.en.html)
