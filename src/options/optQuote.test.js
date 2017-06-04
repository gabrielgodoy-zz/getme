/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import moxios from 'moxios';
import chalk from 'chalk';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

import { response, url } from '../../stubs/quote';
import optQuote from './optQuote';

chai.use(sinonChai);

const commanderMock = {};
let consoleStub;

describe('optQuote', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(url, { status: 200, response });
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    moxios.uninstall();
    console.log.restore();
  });

  it('should console log a random quote and its author', async () => {
    const { quoteText, quoteAuthor } = response;
    const expected = `"${quoteText.trim()}", ${chalk.yellow(quoteAuthor)}`;

    optQuote(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));

    expect(consoleStub).to.have.been.calledWith(expected);
  });
});
