const request = require('request');
const chalk = require('chalk');
const ora = require('ora');
const emoji = require('node-emoji');

let spinner;
const openWeatherPrefix = 'http://api.openweathermap.org/data/2.5/';
const key = '59a950ae5e900327f88558d5cce6dfae';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function weatherUnitAPI(weatherOpts, formatted = false) {
  if (weatherOpts === true) {
    return formatted ? '°C' : 'metric';
  }
  switch (weatherOpts.replace('-', '')) {
    case ('f'):
      return formatted ? '°F' : 'imperial';
    case ('k'):
      return formatted ? 'K' : undefined;
    case ('c'):
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

function getWeather(address, commander) {
  const searchType = commander.weather ? 'weather' : 'forecast';
  const latAndLon = `lat=${address.lat}&lon=${address.lon}`;
  const units = `units=${weatherUnitAPI(commander.weather || commander.forecast)}`;
  const APICall = `${openWeatherPrefix}${searchType}?${latAndLon}&${units}&APPID=${key}`;
  const formattedWeatherUnit = weatherUnitAPI(commander.weather || commander.forecast, true);

  request(APICall, (error, response, body) => {
    spinner.stop();
    if (!error && response.statusCode === 200) {
      const weatherObject = JSON.parse(body);

      if ('weather' in commander) {
        const date = new Date(weatherObject.dt * 1000);
        console.log(`
${address.city}, ${address.country} | ${chalk.yellow(date.toDateString())}
${getWeatherIcon(weatherObject.weather[0].icon)}  ${weatherObject.weather[0].main} | ${capitalize(weatherObject.weather[0].description)}
Temperature ${chalk.blue(weatherObject.main.temp, formattedWeatherUnit)}
Min. ${chalk.blue(weatherObject.main.temp_min, formattedWeatherUnit)} | Max. ${chalk.blue(weatherObject.main.temp_max, formattedWeatherUnit)}
        `);
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

function getAddress(ip, commander) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const address = JSON.parse(body);
      getWeather(address, commander);
    }
  });
}

function optWeather(commander) {
  const loadingType = commander.weather ? 'weather' : 'forecast';
  spinner = ora({
    text: `Loading ${loadingType}`,
    color: 'yellow',
  }).start();
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const ip = JSON.parse(body).ip;
      getAddress(ip, commander);
    }
  });
}

module.exports = optWeather;
