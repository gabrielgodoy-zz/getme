/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import moxios from 'moxios';
import chalk from 'chalk';
import chai, { expect } from 'chai';
import rewire from 'rewire';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

import { response } from '../../stubs/currency';

const optCurrency = rewire('./optCurrency');
chai.use(sinonChai);

let commanderMock;
let consoleStub;

describe('optCurrency', () => {
  beforeEach(() => {
    moxios.install();
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    moxios.uninstall();
    console.log.restore();
  });

  it('should console log USD base currency against all currencies', async () => {
    moxios.stubRequest('http://api.fixer.io/latest?base=USD', { status: 200, response });

    commanderMock = {};
    optCurrency(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));

    expect(consoleStub).to.have.been.calledWith(`\n${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(response.base)}  ${chalk.cyan(response.base)}`);
    expect(consoleStub).to.have.been.calledWith(`\nCurrency Rates\n\n${optCurrency.__get__('formatRates')(response.rates)}`);
  });

  it('should console log USD base currency against currencies defined in symbols parameter', async () => {
    const response2 = {
      base: 'USD',
      date: '2017-01-04',
      rates: {
        BRL: 3.2369,
        EUR: 0.95813,
      },
    };

    moxios.stubRequest('http://api.fixer.io/latest?base=USD&symbols=BRL,EUR', { status: 200, response: response2 });

    commanderMock = { symbols: 'BRL,EUR' };
    optCurrency(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));

    expect(consoleStub).to.have.been.calledWith(`\n${chalk.yellow('Base currency')} ${optCurrency.__get__('getCountryIcon')(response2.base)}  ${chalk.cyan(response2.base)}`);
    expect(consoleStub).to.have.been.calledWith(`\nCurrency Rates\n\n${optCurrency.__get__('formatRates')(response2.rates)}`);
  });

  it('should message user when api reply with error', async () => {
    moxios.stubRequest('http://api.fixer.io/latest?base=USD', { status: 500 });

    commanderMock = {};
    optCurrency(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));

    expect(consoleStub).to.have.been.calledWith(`${chalk.red('Something went wrong in the API. Try in a few minutes')}`);
  });

  it('should message user when request is made with unusual get parameters', async () => {
    moxios.stubRequest('http://api.fixer.io/latest?base=UWERSD', { status: 200, response: 'invalid_json' });

    commanderMock = { base: 'UWERSD' };
    optCurrency(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));

    expect(consoleStub).to.have.been.calledWith(`${chalk.red('It was not possible to retrieve what you want')}`);
  });
});
