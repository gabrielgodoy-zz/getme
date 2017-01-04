/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

const nock = require('nock');
const chalk = require('chalk');
const chai = require('chai');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');

const optCurrency = rewire('./optCurrency');
const expect = chai.expect;
chai.use(sinonChai);

let responseMock;
let commanderMock;
let consoleSpy;

describe('optCurrency', () => {
  beforeEach(() => {
    responseMock = JSON.stringify({
      base: 'USD',
      date: '2017-01-04',
      rates: {
        AUD: 1.3771,
        BGN: 1.8739,
        BRL: 3.2369,
        CAD: 1.3312,
        CHF: 1.0259,
        CNY: 6.9351,
        CZK: 25.89,
        DKK: 7.123,
        GBP: 0.81388,
        HKD: 7.7559,
        HRK: 7.2567,
        HUF: 295.44,
        IDR: 13384.0,
        ILS: 3.8567,
        INR: 68.065,
        JPY: 117.51,
        KRW: 1199.5,
        MXN: 21.147,
        MYR: 4.4975,
        NOK: 8.6141,
        NZD: 1.4395,
        PHP: 49.642,
        PLN: 4.1945,
        RON: 4.3198,
        RUB: 60.753,
        SEK: 9.125,
        SGD: 1.4417,
        THB: 35.81,
        TRY: 3.5822,
        ZAR: 13.645,
        EUR: 0.95813,
      },
    });

    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should console log USD base currency against all currencies', (done) => {
    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'USD' })
      .reply(200, responseMock);

    commanderMock = {};
    optCurrency(commanderMock);
    const responseMockParsed = JSON.parse(responseMock);

    setTimeout(() => {
      expect(consoleSpy).to.have.been.calledWith(`
${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(responseMockParsed.base)}  ${chalk.cyan(responseMockParsed.base)}
-------------\nCurrency Rates\n
${optCurrency.__get__('formatRates')(responseMockParsed.rates)}`);
      done();
    }, 300);
  });

  it('should console log USD base currency against currencies defined in symbols parameter', (done) => {
    const responseMockSymbols = JSON.stringify({
      base: 'USD',
      date: '2017-01-04',
      rates: {
        BRL: 3.2369,
        EUR: 0.95813,
      },
    });

    const responseMockParsed = JSON.parse(responseMockSymbols);

    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'USD', symbols: 'BRL,EUR' })
      .reply(200, responseMockSymbols);

    commanderMock = { symbols: 'BRL,EUR' };
    optCurrency(commanderMock);

    setTimeout(() => {
      expect(consoleSpy).to.have.been.calledWith(`
${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(responseMockParsed.base)}  ${chalk.cyan(responseMockParsed.base)}
-------------\nCurrency Rates\n
${optCurrency.__get__('formatRates')(responseMockParsed.rates)}`);
      done();
    }, 300);
  });

  it('should message user when api reply with error', (done) => {
    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'USD' })
      .replyWithError('Error');

    commanderMock = {};
    optCurrency(commanderMock);
    setTimeout(() => {
      expect(consoleSpy).to.have.been.calledWith(`${chalk.red('Something went wrong in the API. Try in a few minutes')}`);
      done();
    }, 300);
  });

  it('should message user when request is made with unusual get parameters', (done) => {
    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'UWERSD' })
      .reply(200, JSON.stringify({ error: 'Some error' }));

    commanderMock = { base: 'UWERSD' };
    optCurrency(commanderMock);
    setTimeout(() => {
      expect(consoleSpy).to.have.been.calledWith(`${chalk.red('It was not possible to retrieve what you want')}`);
      done();
    }, 300);
  });
});
