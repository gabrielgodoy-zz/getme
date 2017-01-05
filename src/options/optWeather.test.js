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

const stubs = require('../../stubs/weather');

let consoleStub;
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

    consoleStub = sinon.stub(console, 'log');
    commanderMock = {};

    forecastResponseMock = stubs.forecastResponseMock;
    weatherResponseMock = stubs.weatherResponseMock;
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should log weather', (done) => {
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
    setTimeout(() => {
      expect(consoleStub).to.have.been.called;
      done();
    }, 300);
  });

  it('should log forecast', (done) => {
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
    setTimeout(() => {
      expect(consoleStub).to.have.been.called;
      done();
    }, 300);
  });

  it('should use fahrenheit', (done) => {
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
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWithMatch(/27.2 °F/);
      done();
    }, 300);
  });

  it('should use celsius', (done) => {
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
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWithMatch(/27.2 °C/);
      done();
    }, 300);
  });

  it('should use kelvin', (done) => {
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
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWithMatch(/27.2 K/);
      done();
    }, 300);
  });
});
