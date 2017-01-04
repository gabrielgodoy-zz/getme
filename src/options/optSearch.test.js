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
let consoleLogSpy;

describe('optSearch', () => {
  beforeEach(() => {
    queryMock = ['arg1', 'arg2'];

    consoleLogSpy = sinon.spy(console, 'log');
    // Stub to prevent exec() from opening the browser while testing
    childProcessStub = sinon.stub(childProcess, 'exec');
  });

  afterEach(() => {
    childProcess.exec.restore();
    console.log.restore();
  });

  it('Should call child_process.exec with correct search URL', (done) => {
    const queryGoogle = 'https://www.google.com/search?q=';
    optSearch(queryMock);
    setTimeout(() => {
      expect(childProcessStub).to.have.been.calledWith(`open ${queryGoogle}${queryMock.join('+')}`);
      done();
    }, 300);
  });

  it('Should log Searching message to user', (done) => {
    optSearch(queryMock);
    setTimeout(() => {
      expect(consoleLogSpy).to.have.been.calledWith(chalk.blue('Searching for "arg1 arg2" on Google'));
      done();
    }, 300);
  });
});
