/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import moxios from 'moxios';
import chalk from 'chalk';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import optTranslate from './optTranslate';

import { langsResponseMock, langsFormatted } from '../../stubs/translate';

chai.use(sinonChai);

let commanderMock;
let consoleStub;

describe('optTranslate', () => {
  beforeEach(() => {
    moxios.install();
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    moxios.uninstall();
    console.log.restore();
  });

  it('should console log all language options', async () => {
    const expected = langsFormatted;
    commanderMock = { list: true };
    optTranslate('', commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: langsResponseMock });

    expect(consoleStub).to.have.been.calledWith(expected);
  });

  it('should console log the translation', async () => {
    commanderMock = { text: 'test', fromto: 'en-pt' };
    optTranslate('', commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: { text: ['teste'] } });

    expect(consoleStub).to.have.been.calledWith('test');
    expect(consoleStub).to.have.been.calledWith(chalk.blue('teste'));
  });

  it('should console log the translation for all the texts', async () => {
    commanderMock = { text: 'test', fromto: 'en-pt' };
    optTranslate(['specification'], commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: { text: ['teste especificação'] } });

    expect(consoleStub).to.have.been.calledWith('test specification');
    expect(consoleStub).to.have.been.calledWith(chalk.blue('teste especificação'));
  });
});
