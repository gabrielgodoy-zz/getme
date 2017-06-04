/* eslint-disable no-unused-expressions */

import moxios from 'moxios';
import os from 'os';
import chai, { expect } from 'chai';
import chalk from 'chalk';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import optIP from './optIP';

import { networkInterfaces } from '../../stubs/ip';

chai.use(sinonChai);

let consoleStub;
let responseMock;

describe('optIP', () => {
  beforeEach(() => {
    moxios.install();
    responseMock = { ip: '179.215.28.27' }; // Response is valid JSON
    consoleStub = sinon.stub(console, 'log');
    sinon.stub(os, 'networkInterfaces').returns(networkInterfaces);
  });

  afterEach(() => {
    moxios.uninstall();
    os.networkInterfaces.restore();
    console.log.restore();
  });

  it('Should log correct IP addresses to user', async () => {
    const expected = `\nPublic IP ${chalk.blue(responseMock.ip)}\nNetwork IP ${chalk.blue('192.168.0.21')}`;
    optIP();

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: responseMock });

    expect(consoleStub).to.have.been.calledWith(expected);
  });

  it('Should log an error to the user if API problem occurs', async () => {
    optIP();

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 500, response: '' });

    expect(consoleStub).to.have.been.calledWith('It was not possible to retrieve your IP this time');
  });

  it('Should log an error to the user if we get a invalid response', async () => {
    optIP();

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: undefined });

    expect(consoleStub).to.have.been.calledWith('It was not possible to retrieve your IP this time');
  });

  it('Should log an error to the user if somethin else goes wrong', async () => {
    optIP();

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: '' });

    expect(consoleStub).to.have.been.calledWith('It was not possible to retrieve your IP this time');
  });
});
