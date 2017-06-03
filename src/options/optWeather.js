import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import emoji from 'node-emoji';

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

function logWeather(address, date, weatherObject, weatherUnit) {
  const { icon, main, description } = weatherObject.weather[0];
  const { city, country } = address;
  const { temp, temp_min: tempMin, temp_max: tempMax } = weatherObject.main;
  console.log(`${city}, ${country} | ${chalk.yellow(date.toDateString())}`);
  console.log(`${getWeatherIcon(icon)}  ${main} | ${capitalize(description)}`);
  console.log(`Temperature ${chalk.blue(temp, weatherUnit)}`);
  console.log(`Min. ${chalk.blue(tempMin, weatherUnit)} | Max. ${chalk.blue(tempMax, weatherUnit)}`);
  console.log();
}

function logForecast(address, weatherObject, weatherUnit) {
  console.log(`${address.city}, ${address.country}`);
  weatherObject.list
    .map((weather) => {
      const date = new Date(weather.dt_txt);
      const { icon, main, description } = weather.weather[0];
      const { temp, temp_min: tempMin, temp_max: tempMax } = weather.main;

      return { date, icon, main, description, temp, tempMin, tempMax };
    })
    .filter(weather => weather.date.getHours() === 12)
    .forEach((weather) => {
      const { date, icon, main, description, temp, tempMin, tempMax } = weather;
      console.log();
      console.log(`${chalk.yellow(date.toDateString(), ' | ', date.getHours(), 'h')}`);
      console.log(`${getWeatherIcon(icon)}  ${main} | ${capitalize(description)}`);
      console.log(`Temperature ${chalk.blue(temp, weatherUnit)}`);
      console.log(`Min. ${chalk.blue(tempMin, weatherUnit)} | Max. ${chalk.blue(tempMax, weatherUnit)}`);
      console.log();
    });
}

async function getWeather(address, command) {
  const searchType = command.name() === 'weather' ? 'weather' : 'forecast';
  const config = {
    params: {
      lat: address.lat,
      lon: address.lon,
      units: weatherUnitAPI(command),
      APPID: key,
    },
  };
  const formattedWeatherUnit = weatherUnitAPI(command, true);

  try {
    const response = await axios.get(`${openWeatherPrefix}${searchType}`, config);
    const { data, status: statusCode } = response;
    spinner.stop();

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }
    console.log();

    let weather;

    if (command.name() === 'weather') {
      const date = new Date(data.dt * 1000);
      weather = logWeather(address, date, data, formattedWeatherUnit);
    } else {
      weather = logForecast(address, data, formattedWeatherUnit);
    }

    return weather;
  } catch (err) {
    console.error(err, 'getWeather');
    console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
    return err;
  }
}

async function getAddress(ip, command) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const { data, status: statusCode } = response;

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    return getWeather(data, command);
  } catch (err) {
    console.error(err, 'getAdress');
    console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
    return err;
  }
}

async function optWeather(command) {
  const loadingType = command.name() === 'weather' ? 'weather' : 'forecast';
  spinner = ora({
    text: `Loading ${loadingType}`,
    color: 'yellow',
  }).start();

  try {
    const response = await axios.get('https://api.ipify.org', { params: { format: 'json' } });
    const { data, status: statusCode } = response;

    if (statusCode !== 200 || typeof data !== 'object') {
      console.log(chalk.red('It was not possible to retrieve what you want'));
      return false;
    }

    return getAddress(data.ip, command);
  } catch (err) {
    console.error(err);
    console.log(chalk.red('Something went wrong in the API. Try in a few minutes'));
    return err;
  }
}

module.exports = optWeather;
