/* eslint-disable no-unused-expressions */

import nock from 'nock';
import os from 'os';
import chai, { expect } from 'chai';
import chalk from 'chalk';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import optIP from './optIP';

chai.use(sinonChai);

const stubs = require('../../stubs/ip');

const wait = t => new Promise(r => setTimeout(() => r(), t));

let consoleStub;
let responseMock;
let networkInterfacesMock;

describe('optIP', () => {
  beforeEach(() => {
    responseMock = JSON.stringify({ ip: '179.215.28.27' }); // Response is valid JSON
    networkInterfacesMock = stubs.networkInterfaces;
    consoleStub = sinon.stub(console, 'log');
    sinon.stub(os, 'networkInterfaces').returns(networkInterfacesMock);
  });

  afterEach(() => {
    os.networkInterfaces.restore();
    console.log.restore();
  });

  it('Should log correct IP addresses to user', async () => {
    nock('https://api.ipify.org')
      .get('/')
      .query({ format: 'json' }) // GET Query for the API
      .reply(200, responseMock);

    optIP();

    await wait(300);

    expect(consoleStub).to.have.been.calledWith(`\nPublic IP ${chalk.blue('179.215.28.27')}\nNetwork IP ${chalk.blue('192.168.0.21')}`);
  });

  it('Should log an error to user if API problem occurs', async () => {
    nock('https://api.ipify.org')
      .get('/')
      .query({ format: 'json' }) // GET Query for the API
      .replyWithError('Error');

    optIP();

    await wait(300);

    expect(consoleStub).to.have.been.calledWith('It was not possible to retrieve your IP this time');
  });
});
