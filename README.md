![getme](./getme-sm.png)

CLI utility for everyday tasks

With `getme` you can get weather, forecast, currency rate, upload files, IP address, word definitions, text translations, internet speed, do google searches, get inspirational quotes and get Chuck Norris jokes.

✨ All from the terminal ✨

[![NPM](https://nodei.co/npm/getme.png?downloads=true)](https://nodei.co/npm/getme/)

[![npm](https://img.shields.io/npm/v/getme.svg)](https://www.npmjs.com/package/getme)
[![Travis](https://img.shields.io/travis/gabrielgodoy/getme.svg)]()
[![npm](https://img.shields.io/npm/dm/getme.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/gabrielgodoy/getme/badge.svg?branch=master)](https://coveralls.io/github/gabrielgodoy/getme?branch=master)

Install it globally

`npm i getme -g`

### Getme Options

| command                               | definition                                                                                  |
| --------------------------------------| :-------------------------------------------------------------------------------------------|
|`getme -h, --help`                     | Output usage information                                                                    |
|`getme s, search [query]`              | Search in Google                                                                            |
|`getme w, weather [unit]`              | Get weather, default unit is Celsius, can be **celsius, fahrenheit, or kelvin**             |
|`getme f, forecast [unit]`             | Get weather forecast of 5 days ahead, default unit is Celsius                               |
|`getme cur, currency [base] [currs]`   | Get currency rates against a base currency (default base USD, default currencies All)       |
|`getme ip`                             | Get public and network IP addresses                                                         |
|`getme speed`                          | Get internet speed based on [speedtest](http://www.speedtest.net/)                          |
|`getme d, definition [word]`           | Get word definitions (Only works for english words)                                         |
|`getme d, definition -s [word]`        | Get synonyms of a specific word (Only works for english words)                              |
|`getme t, translation [options]`       | Get translations of text from a language to another                                         |
|`getme q, quote`                       | Displays an inspirational quote and its author                                              |
|`getme u, upload [filepath][options]`  | Uploads a file to file.io and generates a link for you to share that file                   |
|`getme chuck`                          | Displays a random Chuck Norris joke                                                         |


## Search on Google
`getme search dogs and cats` Opens browser, searching for "dogs and cats"

![getme-search](./gifs/getme-search.gif)

## Get Weather
`getme weather` Weather in celsius

`getme weather -f` Weather in fahrenheit

`getme forecast` Forecast of five days ahead in celsius

`getme forecast -f` Forecast of five days ahead in fahrenheit

![getme-weather](./gifs/getme-weather.gif)

## Get Currency
`getme currency -s JPY,BRL,CAD` Get JPY, BRL and CAD currencies where base currency is USD (USD is default if no base currency is set)

`getme currency -b EUR -s USD,BRL` Get USD and BRL currency where base currency is EUR

![getme-currency](./gifs/getme-currency.gif)

##### Currency options
Most common base currencies to be passed as parameter:
- USD (Dollar) Default
- EUR (Euro)

For entire list of possible currency initials:
[European Central Bank](http://www.ecb.europa.eu/stats/exchange/eurofxref/html/index.en.html)


## Get you public and network IP addresses
`getme ip`

![getme-ip](./gifs/getme-ip.gif)

## Get your internet download/upload speed, and your ping
`getme speed`

![getme-speed](./gifs/getme-speed.gif)

## Get word definitions (Only works for english words)
`getme definition chair` Get definitions for the word chair

![getme-definition](./gifs/getme-definition.gif)

## Get word synonyms
`getme definition -s teacher` Get synonyms for the word teacher


## Get text translations
`getme translation --fromto en-pt --text The book is on the table` Translate from English to Portuguese "the book is on the table" becomes "O livro está sobre a mesa"

`getme translation --fromto es-en --text El libro está sobre la mesa` Translate from Spanish to English "El libro está sobre la mesa" becomes "The book is on the table"

All text after the `--text` flag will be interpreted as text to be translated

`--fromto` works as a pair of language codes separated by a hyphen ("from"-"to"). For example, en-ru indicates translating from English to Russian.

To get a list of all the possible --fromto combinations, type

`getme translation --list` or `getme translation -l`


![getme-translation](./gifs/getme-translation.gif)

## Get inspirational quotes
`getme quote`
`getme q`

![getme-quote](./gifs/getme-quote.gif)

## Upload files and generate links

Usage:
`getme upload 'path/to/file'`
Example: `getme upload ~/Desktop/test.txt`

Setting custom link expiration

Example: `getme upload ~/Desktop/test.txt -e 1w`

File is uploaded and link will expire in one week

If no expiration is declared, default link expiration is 14 days

Expiration can be in
- days. Example: '1d', '10d'
- weeks. Example: '1w', '5w'
- months. Example: '1m', '5m'
- years. Example: '1y', '5y'

![getme-upload](./gifs/getme-upload.gif)

## Search on Twitter
`getme tweets #node #npm`
`getme t node npm`

### Example

Important:

After the file is downloaded from the generated link, just once, this link will no longer work, it will be destroyed. They call file.io the snapchat for files

File is anonymous and is erased after link expires also, and cannot be retrieved later by accesing the generated link

Read more in [file.io](https://www.file.io/)


## Contributing

We'd love to have your helping hand on getme!

See [CONTRIBUTING.md](https://github.com/gabrielgodoy/getme/blob/master/CONTRIBUTING.md) for more information on what we're looking for and how to get started.


## License

[MIT License](https://gabrielgodoy.mit-license.org/license.html) @ [Gabriel Godoy](https://github.com/gabrielgodoy)
