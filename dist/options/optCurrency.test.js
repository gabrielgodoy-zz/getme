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

var stubs = require('../../stubs/currency');

var responseMock = void 0;
var commanderMock = void 0;
var consoleStub = void 0;

describe('optCurrency', function () {
  beforeEach(function () {
    responseMock = stubs.response;
    consoleStub = sinon.stub(console, 'log');
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
      expect(consoleStub).to.have.been.calledWith('\n' + chalk.yellow('Base currency') + ' ' + optCurrency.__get__('getCountryIcon')(responseMockParsed.base) + '  ' + chalk.cyan(responseMockParsed.base));
      expect(consoleStub).to.have.been.calledWith('\nCurrency Rates\n\n' + optCurrency.__get__('formatRates')(responseMockParsed.rates));
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
      expect(consoleStub).to.have.been.calledWith('\n' + chalk.yellow('Base currency') + ' ' + optCurrency.__get__('getCountryIcon')(responseMockParsed.base) + '  ' + chalk.cyan(responseMockParsed.base));
      expect(consoleStub).to.have.been.calledWith('\nCurrency Rates\n\n' + optCurrency.__get__('formatRates')(responseMockParsed.rates));
      done();
    }, 300);
  });

  it('should message user when api reply with error', function (done) {
    nock('http://api.fixer.io').get('/latest').query({ base: 'USD' }).replyWithError('Error');

    commanderMock = {};
    optCurrency(commanderMock);
    setTimeout(function () {
      expect(consoleStub).to.have.been.calledWith('' + chalk.red('Something went wrong in the API. Try in a few minutes'));
      done();
    }, 300);
  });

  it('should message user when request is made with unusual get parameters', function (done) {
    nock('http://api.fixer.io').get('/latest').query({ base: 'UWERSD' }).reply(200, JSON.stringify({ error: 'Some error' }));

    commanderMock = { base: 'UWERSD' };
    optCurrency(commanderMock);
    setTimeout(function () {
      expect(consoleStub).to.have.been.calledWith('' + chalk.red('It was not possible to retrieve what you want'));
      done();
    }, 300);
  });
});