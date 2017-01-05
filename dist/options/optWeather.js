'use strict';

var request = require('request');
var chalk = require('chalk');
var ora = require('ora');
var emoji = require('node-emoji');

var spinner = void 0;
var openWeatherPrefix = 'http://api.openweathermap.org/data/2.5/';
var key = '59a950ae5e900327f88558d5cce6dfae';

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
  switch (iconID) {
    case '01d':
      return emoji.get('sunny');
    case '02d':
      return emoji.get('partly_sunny');
    case '03d':
      return emoji.get('cloud');
    case '04d':
      return emoji.get('cloud');
    case '09d':
      return emoji.get('rain_cloud');
    case '10d':
      return emoji.get('partly_sunny_rain');
    case '11d':
      return emoji.get('partly_sunny_rain');
    case '13d':
      return emoji.get('snowflake');
    case '50d':
      return emoji.get('wind_blowing_face');
    case '01n':
      return emoji.get('full_moon_with_face');
    case '02n':
      return emoji.get('cloud');
    case '03n':
      return emoji.get('cloud');
    case '04n':
      return emoji.get('cloud');
    case '09n':
      return emoji.get('rain_cloud');
    case '10n':
      return emoji.get('rain_cloud');
    case '11n':
      return emoji.get('lightning');
    case '13n':
      return emoji.get('snowflake');
    case '50n':
      return emoji.get('wind_blowing_face');
    default:
      return emoji.get('sunny');
  }
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

      if (command.name() === 'weather') {
        var date = new Date(weatherObject.dt * 1000);
        console.log('\n' + address.city + ', ' + address.country + ' | ' + chalk.yellow(date.toDateString()) + '\n' + getWeatherIcon(weatherObject.weather[0].icon) + '  ' + weatherObject.weather[0].main + ' | ' + capitalize(weatherObject.weather[0].description) + '\nTemperature ' + chalk.blue(weatherObject.main.temp, formattedWeatherUnit) + '\nMin. ' + chalk.blue(weatherObject.main.temp_min, formattedWeatherUnit) + ' | Max. ' + chalk.blue(weatherObject.main.temp_max, formattedWeatherUnit));
      } else {
        console.log('\n' + address.city + ', ' + address.country);
        weatherObject.list.forEach(function (weather) {
          if (weather.dt_txt.indexOf('12') > -1) {
            var _date = new Date(weather.dt_txt);
            console.log('\n' + chalk.yellow(_date.toDateString(), ' | ', _date.getHours(), 'h') + '\n' + getWeatherIcon(weather.weather[0].icon) + '  ' + weather.weather[0].main + ' | ' + capitalize(weather.weather[0].description) + '\nTemperature ' + chalk.blue(weather.main.temp, formattedWeatherUnit) + '\nMin. ' + chalk.blue(weather.main.temp_min, formattedWeatherUnit) + ' | Max. ' + chalk.blue(weather.main.temp_max, formattedWeatherUnit) + '\n            ');
          }
        });
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