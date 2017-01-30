/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import nock from 'nock';
import chalk from 'chalk';
import chai, { expect } from 'chai';
import rewire from 'rewire';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

const optCurrency = rewire('./optCurrency');
chai.use(sinonChai);

const stubs = require('../../stubs/currency');

const wait = t => new Promise(r => setTimeout(() => r(), t));

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

  it('should console log USD base currency against all currencies', async () => {
    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'USD' })
      .reply(200, responseMock);

    commanderMock = {};
    optCurrency(commanderMock);
    const responseMockParsed = JSON.parse(responseMock);

    await wait(300);

    expect(consoleStub).to.have.been.calledWith(`\n${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(responseMockParsed.base)}  ${chalk.cyan(responseMockParsed.base)}`);
    expect(consoleStub).to.have.been.calledWith(`\nCurrency Rates\n\n${optCurrency.__get__('formatRates')(responseMockParsed.rates)}`);
  });

  it('should console log USD base currency against currencies defined in symbols parameter', async () => {
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

    await wait(300);

    expect(consoleStub).to.have.been.calledWith(`\n${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(responseMockParsed.base)}  ${chalk.cyan(responseMockParsed.base)}`);
    expect(consoleStub).to.have.been.calledWith(`\nCurrency Rates\n\n${optCurrency.__get__('formatRates')(responseMockParsed.rates)}`);
  });

  it('should message user when api reply with error', async () => {
    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'USD' })
      .replyWithError('Error');

    commanderMock = {};
    optCurrency(commanderMock);

    await wait(300);

    expect(consoleStub).to.have.been.calledWith(`${chalk.red('Something went wrong in the API. Try in a few minutes')}`);
  });

  it('should message user when request is made with unusual get parameters', async () => {
    nock('http://api.fixer.io')
      .get('/latest')
      .query({ base: 'UWERSD' })
      .reply(200, 'invalid_json');

    commanderMock = { base: 'UWERSD' };
    optCurrency(commanderMock);

    await wait(300);

    expect(consoleStub).to.have.been.calledWith(`${chalk.red('It was not possible to retrieve what you want')}`);
  });
});
