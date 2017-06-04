
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import moxios from 'moxios';
import chalk from 'chalk';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

import optChuckNorris from './optChuckNorris';

const responseMock = { value: 'Chuck Norris built the Panama Canal with his left foot.' };

chai.use(sinonChai);

const commanderMock = {};
let consoleStub;

describe('optChuckNorris', () => {
  beforeEach(() => {
    moxios.install();
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    moxios.uninstall();
    console.log.restore();
  });

  it('should console log a random badass quote from Chuck fucking Norris', async () => {
    optChuckNorris(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: responseMock });

    expect(consoleStub).to.have.been.calledWith(`Chuck says: ${chalk.red(responseMock.value)}`);
  });

  it('should let the user know that it was not possible to retrieve a badass quote', async () => {
    optChuckNorris(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 500, response: '' });

    expect(consoleStub).to.have.been.calledWith('Chuck is busy now, try again later.');
  });

  it('should let the user know that Chuck Norris is fucking busy', async () => {
    optChuckNorris(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: 'non_sense' });

    expect(consoleStub).to.have.been.calledWith(`${chalk.red('It was not possible to retrieve what you want')}`);
  });
});
