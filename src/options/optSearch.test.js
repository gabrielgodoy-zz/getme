/* eslint-disable no-unused-expressions */

import chalk from 'chalk';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import childProcess from 'child_process';
import optSearch from './optSearch';

chai.use(sinonChai);

const wait = t => new Promise(r => setTimeout(r, t));

let queryMock;
let childProcessStub;
let consoleLogStub;

describe('optSearch', () => {
  beforeEach(() => {
    queryMock = ['arg1', 'arg2'];

    consoleLogStub = sinon.stub(console, 'log');
    // Stub to prevent exec() from opening the browser while testing
    childProcessStub = sinon.stub(childProcess, 'exec');
  });

  afterEach(() => {
    childProcess.exec.restore();
    console.log.restore();
  });

  it('Should call child_process.exec with correct search URL', async () => {
    const queryGoogle = 'https://www.google.com/search?q=';
    // mock process for proper open command call
    Object.defineProperty(process, 'platform', { value: 'unix' });
    optSearch(queryMock);

    await wait(300);

    expect(childProcessStub).to.have.been.calledWith(`open ${queryGoogle}${queryMock.join('+')}`);
  });

  it('Should call child_process.exec with correct search URL and win32 open command', async () => {
    const queryGoogle = 'https://www.google.com/search?q=';
    // mock process for proper open command call
    Object.defineProperty(process, 'platform', { value: 'win32' });
    optSearch(queryMock);

    await wait(300);

    expect(childProcessStub).to.have.been.calledWith(`start ${queryGoogle}${queryMock.join('+')}`);
  });

  it('Should log Searching message to user', async () => {
    optSearch(queryMock);

    await wait(300);

    expect(consoleLogStub).to.have.been.calledWith(chalk.blue('Searching for "arg1 arg2" on Google'));
  });
});
