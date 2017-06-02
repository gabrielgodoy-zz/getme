/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import nock from 'nock';
import rewire from 'rewire';

const optWeather = rewire('./optWeather');

chai.use(sinonChai);

const stubs = require('../../stubs/weather');

const wait = t => new Promise(r => setTimeout(r, t));

let consoleStub;
let commanderMock;
let responseAPIMock;
let responseAddressMock;
let weatherResponseMock;
let forecastResponseMock;

describe('optWeather', () => {
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

    consoleStub = sinon.stub(console, 'log');
    commanderMock = {};

    forecastResponseMock = stubs.forecastResponseMock;
    weatherResponseMock = stubs.weatherResponseMock;
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should log weather', async () => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    nock(openWeatherPrefix)
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

    await wait(300);

    expect(consoleStub).to.have.been.calledWithMatch(/Niterói, Brazil | Wed Jan 04 2017/);
    expect(consoleStub).to.have.been.calledWithMatch(/30.57 °C/);
    expect(consoleStub).to.have.been.calledWithMatch(/28 °C/);
    expect(consoleStub).to.have.been.calledWithMatch(/33 °C/);
  });

  it('should log forecast', async () => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    nock(openWeatherPrefix)
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

    await wait(300);

    JSON.parse(forecastResponseMock).list
      .forEach((item) => {
        const { temp, temp_min: tempMin, temp_max: tempMax } = item.main;
        if (new Date(item.dt).getHours() === 12) {
          expect(consoleStub).to.have.been.calledWithMatch(temp);
          expect(consoleStub).to.have.been.calledWithMatch(tempMin);
          expect(consoleStub).to.have.been.calledWithMatch(tempMax);
        } else {
          expect(consoleStub).not.to.have.been.calledWithMatch(temp);
          expect(consoleStub).not.to.have.been.calledWithMatch(tempMin);
          expect(consoleStub).not.to.have.been.calledWithMatch(tempMax);
        }
      });
  });

  it('should use fahrenheit', async () => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    commanderMock.name = () => 'forecast';
    commanderMock.fahrenheit = true;

    nock(openWeatherPrefix)
      .get('/data/2.5/forecast')
      .query({
        lat: -22.9021,
        lon: -43.1303,
        units: 'imperial',
        APPID: '59a950ae5e900327f88558d5cce6dfae',
      })
      .reply(200, forecastResponseMock);

    optWeather(commanderMock);

    await wait(300);

    expect(consoleStub).to.have.been.calledWithMatch(/27.2 °F/);
  });

  it('should use celsius', async () => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    commanderMock.name = () => 'forecast';
    commanderMock.celsius = true;

    nock(openWeatherPrefix)
      .get('/data/2.5/forecast')
      .query({
        lat: -22.9021,
        lon: -43.1303,
        units: 'metric',
        APPID: '59a950ae5e900327f88558d5cce6dfae',
      })
      .reply(200, forecastResponseMock);

    optWeather(commanderMock);

    await wait(300);

    expect(consoleStub).to.have.been.calledWithMatch(/27.2 °C/);
  });

  it('should use kelvin', async () => {
    const openWeatherPrefix = 'http://api.openweathermap.org';
    commanderMock.name = () => 'forecast';
    commanderMock.kelvin = true;

    nock(openWeatherPrefix)
      .get('/data/2.5/forecast')
      .query({
        lat: -22.9021,
        lon: -43.1303,
        units: 'undefined',
        APPID: '59a950ae5e900327f88558d5cce6dfae',
      })
      .reply(200, forecastResponseMock);

    optWeather(commanderMock);

    await wait(300);

    expect(consoleStub).to.have.been.calledWithMatch(/27.2 K/);
  });
});
