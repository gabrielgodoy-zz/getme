/* eslint-disable no-unused-expressions */

const chalk = require('chalk');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const childProcess = require('child_process');
const optSearch = require('./optSearch');

const expect = chai.expect;
chai.use(sinonChai);

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

  it('Should call child_process.exec with correct search URL', (done) => {
    const queryGoogle = 'https://www.google.com/search?q=';
    // mock process for proper open command call
    Object.defineProperty(process, 'platform', { value: 'unix' });
    optSearch(queryMock);
    setTimeout(() => {
      expect(childProcessStub).to.have.been.calledWith(`open ${queryGoogle}${queryMock.join('+')}`);
      done();
    }, 300);
  });

  it('Should call child_process.exec with correct search URL and win32 open command', (done) => {
    const queryGoogle = 'https://www.google.com/search?q=';
    // mock process for proper open command call
    Object.defineProperty(process, 'platform', { value: 'win32' });
    optSearch(queryMock);
    setTimeout(() => {
      expect(childProcessStub).to.have.been.calledWith(`start ${queryGoogle}${queryMock.join('+')}`);
      done();
    }, 300);
  });

  it('Should log Searching message to user', (done) => {
    optSearch(queryMock);
    setTimeout(() => {
      expect(consoleLogStub).to.have.been.calledWith(chalk.blue('Searching for "arg1 arg2" on Google'));
      done();
    }, 300);
  });
});
