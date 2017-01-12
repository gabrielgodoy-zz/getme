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

const stubs = require('../../stubs/currency');

let responseMock;
let commanderMock;
let consoleStub;

describe('optCurrency', () => {
  beforeEach(() => {
    responseMock = stubs.response;
    consoleStub = sinon.stub(console, 'log');
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
      expect(consoleStub).to.have.been.calledWith(`\n${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(responseMockParsed.base)}  ${chalk.cyan(responseMockParsed.base)}`);
      expect(consoleStub).to.have.been.calledWith(`\nCurrency Rates\n\n${optCurrency.__get__('formatRates')(responseMockParsed.rates)}`);
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
      expect(consoleStub).to.have.been.calledWith(`\n${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(responseMockParsed.base)}  ${chalk.cyan(responseMockParsed.base)}`);
      expect(consoleStub).to.have.been.calledWith(`\nCurrency Rates\n\n${optCurrency.__get__('formatRates')(responseMockParsed.rates)}`);
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
      expect(consoleStub).to.have.been.calledWith(`${chalk.red('Something went wrong in the API. Try in a few minutes')}`);
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
      expect(consoleStub).to.have.been.calledWith(`${chalk.red('It was not possible to retrieve what you want')}`);
      done();
    }, 300);
  });
});
