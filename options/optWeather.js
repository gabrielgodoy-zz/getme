const request = require('request');
const chalk = require('chalk');

const openWeatherPrefix = 'http://api.openweathermap.org/data/2.5/';
const key = '59a950ae5e900327f88558d5cce6dfae';

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

function getWeather(address, commander) {
  const searchType = commander.weather ? 'weather' : 'forecast';
  const latAndLon = `lat=${address.lat}&lon=${address.lon}`;
  const units = `units=${weatherUnitAPI(commander.weather || commander.forecast)}`;
  const APICall = `${openWeatherPrefix}${searchType}?${latAndLon}&${units}&APPID=${key}`;
  const formattedWeatherUnit = weatherUnitAPI(commander.weather || commander.forecast, true);
  request(APICall, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const weatherObject = JSON.parse(body);

      if ('weather' in commander) {
        const date = new Date(weatherObject.dt * 1000);
        console.log(`
${address.city}, ${address.country}
${chalk.yellow(date.toDateString())}
Temperature ${chalk.blue(weatherObject.main.temp, formattedWeatherUnit)}
Max. ${chalk.blue(weatherObject.main.temp_min, formattedWeatherUnit)} | Min. ${chalk.blue(weatherObject.main.temp_max, formattedWeatherUnit)}
        `);
      } else {
        console.log(`
${address.city}, ${address.country}`);
        weatherObject.list.forEach((weather) => {
          if (weather.dt_txt.indexOf('12') > -1) {
            const date = new Date(weather.dt_txt);
            console.log(`
${chalk.yellow(date.toDateString())}
Temperature ${chalk.blue(weather.main.temp, formattedWeatherUnit)}
Max. ${chalk.blue(weather.main.temp_min, formattedWeatherUnit)} | Min. ${chalk.blue(weather.main.temp_max, formattedWeatherUnit)}
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
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const ip = JSON.parse(body).ip;
      getAddress(ip, commander);
    }
  });
}

module.exports = optWeather;
