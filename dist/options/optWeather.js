'use strict';

var request = require('request');
var chalk = require('chalk');
var ora = require('ora');
var emoji = require('node-emoji');

var spinner = void 0;
var openWeatherPrefix = 'http://api.openweathermap.org/data/2.5/';
var key = '59a950ae5e900327f88558d5cce6dfae';

var emojis = {
  '01d': 'sunny',
  '02d': 'partly_sunny',
  '03d': 'cloud',
  '04d': 'cloud',
  '09d': 'rain_cloud',
  '10d': 'partly_sunny_rain',
  '11d': 'partly_sunny_rain',
  '13d': 'snowflake',
  '50d': 'wind_blowing_face',
  '01n': 'full_moon_with_face',
  '02n': 'cloud',
  '03n': 'cloud',
  '04n': 'cloud',
  '09n': 'rain_cloud',
  '10n': 'rain_cloud',
  '11n': 'lightning',
  '13n': 'snowflake',
  '50n': 'wind_blowing_face'
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function weatherUnitAPI(command) {
  var formatted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  switch (true) {
    case command.fahrenheit:
      return formatted ? '°F' : 'imperial';
    case command.kelvin:
      return formatted ? 'K' : undefined;
    case command.celsius:
    default:
      return formatted ? '°C' : 'metric';
  }
}

function getWeatherIcon(iconID) {
  return emoji.get(emojis[iconID]);
}

function logWeather(address, date, weatherObject, weatherUnit) {
  var _weatherObject$weathe = weatherObject.weather[0],
      icon = _weatherObject$weathe.icon,
      main = _weatherObject$weathe.main,
      description = _weatherObject$weathe.description;
  var city = address.city,
      country = address.country;
  var _weatherObject$main = weatherObject.main,
      temp = _weatherObject$main.temp,
      tempMin = _weatherObject$main.temp_min,
      tempMax = _weatherObject$main.temp_max;

  console.log(city + ', ' + country + ' | ' + chalk.yellow(date.toDateString()));
  console.log(getWeatherIcon(icon) + '  ' + main + ' | ' + capitalize(description));
  console.log('Temperature ' + chalk.blue(temp, weatherUnit));
  console.log('Min. ' + chalk.blue(tempMin, weatherUnit) + ' | Max. ' + chalk.blue(tempMax, weatherUnit));
  console.log();
}

function logForecast(address, weatherObject, weatherUnit) {
  console.log(address.city + ', ' + address.country);
  weatherObject.list.map(function (weather) {
    var date = new Date(weather.dt_txt);
    var _weather$weather$ = weather.weather[0],
        icon = _weather$weather$.icon,
        main = _weather$weather$.main,
        description = _weather$weather$.description;
    var _weather$main = weather.main,
        temp = _weather$main.temp,
        tempMin = _weather$main.temp_min,
        tempMax = _weather$main.temp_max;


    return { date: date, icon: icon, main: main, description: description, temp: temp, tempMin: tempMin, tempMax: tempMax };
  }).filter(function (weather) {
    return weather.date.getHours() === 12;
  }).forEach(function (weather) {
    var date = weather.date,
        icon = weather.icon,
        main = weather.main,
        description = weather.description,
        temp = weather.temp,
        tempMin = weather.tempMin,
        tempMax = weather.tempMax;

    console.log();
    console.log('' + chalk.yellow(date.toDateString(), ' | ', date.getHours(), 'h'));
    console.log(getWeatherIcon(icon) + '  ' + main + ' | ' + capitalize(description));
    console.log('Temperature ' + chalk.blue(temp, weatherUnit));
    console.log('Min. ' + chalk.blue(tempMin, weatherUnit) + ' | Max. ' + chalk.blue(tempMax, weatherUnit));
    console.log();
  });
}

function getWeather(address, command) {
  var searchType = command.name() === 'weather' ? 'weather' : 'forecast';
  var latAndLon = 'lat=' + address.lat + '&lon=' + address.lon;
  var units = 'units=' + weatherUnitAPI(command);
  var APICall = '' + openWeatherPrefix + searchType + '?' + latAndLon + '&' + units + '&APPID=' + key;
  var formattedWeatherUnit = weatherUnitAPI(command, true);

  request(APICall, function (error, response, body) {
    spinner.stop();
    if (!error && response.statusCode === 200) {
      var weatherObject = JSON.parse(body);

      console.log();
      if (command.name() === 'weather') {
        var date = new Date(weatherObject.dt * 1000);
        logWeather(address, date, weatherObject, formattedWeatherUnit);
      } else {
        logForecast(address, weatherObject, formattedWeatherUnit);
      }
    }
  });
}

function getAddress(ip, command) {
  request('http://ip-api.com/json/' + ip, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var address = JSON.parse(body);
      getWeather(address, command);
    }
  });
}

function optWeather(command) {
  var loadingType = command.name() === 'weather' ? 'weather' : 'forecast';
  spinner = ora({
    text: 'Loading ' + loadingType,
    color: 'yellow'
  }).start();
  request('https://api.ipify.org?format=json', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var ip = JSON.parse(body).ip;
      getAddress(ip, command);
    }
  });
}

module.exports = optWeather;