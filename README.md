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

| command                               | definition                                                                                  |
| --------------------------------------| :-------------------------------------------------------------------------------------------|
|`-h, --help`                           | Output usage information                                                                    |
|`s, search [query]`                    | Search in Google                                                                            |
|`w, weather [unit]`                    | Get weather, default unit is Celsius, can be **celsius, fahrenheit, or kelvin**             |
|`f, forecast [unit]`                   | Get weather forecast of 5 days ahead, default unit is Celsius                               |
|`cur, currency [base] [currs]`         | Get currency rates against a base currency (default base USD, default currencies All)       |
|`ip`                                   | Get public and network IP addresses                                                         |
|`speed`                                | Get internet speed based on [speedtest](http://www.speedtest.net/)                          |
|`d, definition [word]`                 | Get word definitions                                                                        |
|`d, definition -s [word]`              | Get synonyms of a specific word                                                             |
|`t, translation [options]`             | Get translations of text from a language to another                                         |


### Examples of getmes

#### Search on Google
`getme search dogs and cats` Opens browser, searching for "dogs and cats"

#### Get Currency
`getme currency -s JPY,BRL,CAD` Get JPY, BRL and CAD currencies where base currency is USD (USD is default if no base currency is set)

`getme currency -b EUR -s USD,BRL` Get USD and BRL currency where base currency is EUR

##### Currency options
Most common base currencies to be passed as parameter:
- USD (Dollar) Default
- EUR (Euro)

For entire list of possible currency initials: 
[European Central Bank](http://www.ecb.europa.eu/stats/exchange/eurofxref/html/index.en.html)

#### Get Weather
`getme weather` Weather in celsius

`getme weather -f` Weather in fahrenheit

`getme forecast` Forecast of five days ahead in celsius

`getme forecast -f` Forecast of five days ahead in fahrenheit

#### Get word definitions (Only works for english words for now)
`getme definition chair` Get definitions for the word chair

#### Get word synonyms
`getme definition -s teacher` Get synonyms for the word teacher

#### Get text translations
`getme translation --fromto en-pt --text the book is on the table` Translate from English to Portuguese "the book is on the table" becomes "o livro está sobre a mesa"

`getme translation --fromto pt-ru --text o livro está sobre a mesa` Translate from Portuguese to Russian "o livro está sobre a mesa" becomes "книга на столе"

`--fromto` works as a pair of language codes separated by a hyphen ("from"-"to"). For example, en-ru indicates translating from English to Russian.

Every text after the `--text` flag will be interpreted as text to be translated

##### To get all pair of languages available for translation, type
`getme translation --list`

#### Get you public and network IP addresses
`getme ip`

#### Get your internet download/upload speed, and your ping
`getme speed`
