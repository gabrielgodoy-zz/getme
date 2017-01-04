/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const nock = require('nock');
const rewire = require('rewire');

const optWeather = rewire('./optWeather');
const expect = chai.expect;
chai.use(sinonChai);

let consoleSpy;
let commanderMock;
let responseAPIMock;
let responseAddressMock;
let weatherResponseMock;
let forecastResponseMock;

describe('optSpeed', () => {
  beforeEach(() => {
    responseAPIMock = JSON.stringify({ ip: '179.215.28.27' }); // Response is valid JSON

    nock('https://api.ipify.org')
      .get('/')
      .query({ format: 'json' }) // GET Query for the API
      .reply(200, responseAPIMock);

    responseAddressMock = JSON.stringify({
      city: 'Niterói',
      country: 'Brazil',
      countryCode: 'BR',
      lat: -22.9021,
      lon: -43.1303,
    });

    nock('http://ip-api.com')
      .get(`/json/${JSON.parse(responseAPIMock).ip}`)
      .reply(200, responseAddressMock);

    consoleSpy = sinon.spy(console, 'log');
    commanderMock = {};

    forecastResponseMock = JSON.stringify({
      city: {
        id: 3473648,
        name: 'Icaraí',
        coord: {
          lon: -43.09972,
          lat: -22.9,
        },
        country: 'BR',
        population: 0,
        sys: {
          population: 0,
        },
      },
      list: [
        {
          dt: 1483574400,
          main: {
            temp: 27.2,
            temp_min: 27.2,
            temp_max: 29.16,
          },
          weather: [
            {
              id: 802,
              main: 'Clouds',
              description: 'scattered clouds',
              icon: '03n',
            },
          ],
          dt_txt: '2017-01-05 12:00:00',
        },
        {
          dt: 1483606800,
          main: {
            temp: 24.98,
            temp_min: 24.98,
            temp_max: 25.47,
          },
          weather: [
            {
              id: 500,
              main: 'Rain',
              description: 'light rain',
              icon: '10d',
            },
          ],
          dt_txt: '2017-01-05 09:00:00',
        },
      ],
    });

    weatherResponseMock = JSON.stringify({
      weather: [
        {
          id: 211,
          main: 'Thunderstorm',
          description: 'thunderstorm',
          icon: '11n',
        },
      ],
      main: {
        temp: 30.57,
        pressure: 1009,
        humidity: 59,
        temp_min: 28,
        temp_max: 33,
      },
      dt: 1483567200,
    });
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should log weather', (done) => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    nock(`${openWeatherPrefix}`)
      .get('/data/2.5/weather')
      .query({
        lat: -22.9021,
        lon: -43.1303,
        units: 'metric',
        APPID: '59a950ae5e900327f88558d5cce6dfae',
      })
      .reply(200, weatherResponseMock);

    commanderMock.name = () => 'weather';
    optWeather(commanderMock);
    setTimeout(() => {
      expect(consoleSpy).to.have.been.called;
      done();
    }, 300);
  });

  it('should log forecast', (done) => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    nock(`${openWeatherPrefix}`)
      .get('/data/2.5/forecast')
      .query({
        lat: -22.9021,
        lon: -43.1303,
        units: 'metric',
        APPID: '59a950ae5e900327f88558d5cce6dfae',
      })
      .reply(200, forecastResponseMock);

    commanderMock.name = () => 'forecast';
    optWeather(commanderMock);
    setTimeout(() => {
      expect(consoleSpy).to.have.been.called;
      done();
    }, 300);
  });
});
