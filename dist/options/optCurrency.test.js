'use strict';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

var nock = require('nock');
var chalk = require('chalk');
var chai = require('chai');
var rewire = require('rewire');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');

var optCurrency = rewire('./optCurrency');
var expect = chai.expect;
chai.use(sinonChai);

var responseMock = void 0;
var commanderMock = void 0;
var consoleSpy = void 0;

describe('optCurrency', function () {
  beforeEach(function () {
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
        EUR: 0.95813
      }
    });

    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  it('should console log USD base currency against all currencies', function (done) {
    nock('http://api.fixer.io').get('/latest').query({ base: 'USD' }).reply(200, responseMock);

    commanderMock = {};
    optCurrency(commanderMock);
    var responseMockParsed = JSON.parse(responseMock);

    setTimeout(function () {
      expect(consoleSpy).to.have.been.calledWith('\n' + chalk.yellow('Base currency') + ' ' + optCurrency.__get__('getCountryIcon')(responseMockParsed.base) + '  ' + chalk.cyan(responseMockParsed.base) + '\n-------------\nCurrency Rates\n\n' + optCurrency.__get__('formatRates')(responseMockParsed.rates));
      done();
    }, 300);
  });

  it('should console log USD base currency against currencies defined in symbols parameter', function (done) {
    var responseMockSymbols = JSON.stringify({
      base: 'USD',
      date: '2017-01-04',
      rates: {
        BRL: 3.2369,
        EUR: 0.95813
      }
    });

    var responseMockParsed = JSON.parse(responseMockSymbols);

    nock('http://api.fixer.io').get('/latest').query({ base: 'USD', symbols: 'BRL,EUR' }).reply(200, responseMockSymbols);

    commanderMock = { symbols: 'BRL,EUR' };
    optCurrency(commanderMock);

    setTimeout(function () {
      expect(consoleSpy).to.have.been.calledWith('\n' + chalk.yellow('Base currency') + ' ' + optCurrency.__get__('getCountryIcon')(responseMockParsed.base) + '  ' + chalk.cyan(responseMockParsed.base) + '\n-------------\nCurrency Rates\n\n' + optCurrency.__get__('formatRates')(responseMockParsed.rates));
      done();
    }, 300);
  });

  it('should message user when api reply with error', function (done) {
    nock('http://api.fixer.io').get('/latest').query({ base: 'USD' }).replyWithError('Error');

    commanderMock = {};
    optCurrency(commanderMock);
    setTimeout(function () {
      expect(consoleSpy).to.have.been.calledWith('' + chalk.red('Something went wrong in the API. Try in a few minutes'));
      done();
    }, 300);
  });

  it('should message user when request is made with unusual get parameters', function (done) {
    nock('http://api.fixer.io').get('/latest').query({ base: 'UWERSD' }).reply(200, JSON.stringify({ error: 'Some error' }));

    commanderMock = { base: 'UWERSD' };
    optCurrency(commanderMock);
    setTimeout(function () {
      expect(consoleSpy).to.have.been.calledWith('' + chalk.red('It was not possible to retrieve what you want'));
      done();
    }, 300);
  });
});