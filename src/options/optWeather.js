const request = require('request');
const chalk = require('chalk');
const ora = require('ora');
const emoji = require('node-emoji');

let spinner;
const openWeatherPrefix = 'http://api.openweathermap.org/data/2.5/';
const key = '59a950ae5e900327f88558d5cce6dfae';

const emojis = {
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
  '50n': 'wind_blowing_face',
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function weatherUnitAPI(command, formatted = false) {
  switch (true) {
    case (command.fahrenheit):
      return formatted ? '°F' : 'imperial';
    case (command.kelvin):
      return formatted ? 'K' : undefined;
    case (command.celsius):
    default:
      return formatted ? '°C' : 'metric';
  }
}

function getWeatherIcon(iconID) {
  return emoji.get(emojis[iconID]);
}

function getWeather(address, command) {
  const searchType = command.name() === 'weather' ? 'weather' : 'forecast';
  const latAndLon = `lat=${address.lat}&lon=${address.lon}`;
  const units = `units=${weatherUnitAPI(command)}`;
  const APICall = `${openWeatherPrefix}${searchType}?${latAndLon}&${units}&APPID=${key}`;
  const formattedWeatherUnit = weatherUnitAPI(command, true);

  request(APICall, (error, response, body) => {
    spinner.stop();
    if (!error && response.statusCode === 200) {
      const weatherObject = JSON.parse(body);

      if (command.name() === 'weather') {
        const date = new Date(weatherObject.dt * 1000);
        console.log(`
${address.city}, ${address.country} | ${chalk.yellow(date.toDateString())}
${getWeatherIcon(weatherObject.weather[0].icon)}  ${weatherObject.weather[0].main} | ${capitalize(weatherObject.weather[0].description)}
Temperature ${chalk.blue(weatherObject.main.temp, formattedWeatherUnit)}
Min. ${chalk.blue(weatherObject.main.temp_min, formattedWeatherUnit)} | Max. ${chalk.blue(weatherObject.main.temp_max, formattedWeatherUnit)}`);
      } else {
        console.log(`
${address.city}, ${address.country}`);
        weatherObject.list.forEach((weather) => {
          if (weather.dt_txt.indexOf('12') > -1) {
            const date = new Date(weather.dt_txt);
            console.log(`
${chalk.yellow(date.toDateString(), ' | ', date.getHours(), 'h')}
${getWeatherIcon(weather.weather[0].icon)}  ${weather.weather[0].main} | ${capitalize(weather.weather[0].description)}
Temperature ${chalk.blue(weather.main.temp, formattedWeatherUnit)}
Min. ${chalk.blue(weather.main.temp_min, formattedWeatherUnit)} | Max. ${chalk.blue(weather.main.temp_max, formattedWeatherUnit)}
            `);
          }
        });
      }
    }
  });
}

function getAddress(ip, command) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const address = JSON.parse(body);
      getWeather(address, command);
    }
  });
}

function optWeather(command) {
  const loadingType = command.name() === 'weather' ? 'weather' : 'forecast';
  spinner = ora({
    text: `Loading ${loadingType}`,
    color: 'yellow',
  }).start();
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const ip = JSON.parse(body).ip;
      getAddress(ip, command);
    }
  });
}

module.exports = optWeather;
