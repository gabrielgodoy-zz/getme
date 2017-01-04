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
let childProcessSpy;
let consoleLogSpy;

describe('optSearch', () => {
  beforeEach(() => {
    queryMock = ['arg1', 'arg2'];
  });

  it('Should call child_process.exec once successfully', (done) => {
    childProcessSpy = sinon.spy(childProcess, 'exec');

    optSearch(queryMock);
    setTimeout(() => {
      expect(childProcessSpy).to.have.been.calledOnce;
      childProcess.exec.restore();
      done();
    }, 300);
  });

  it('Should log message to user if search was successful', (done) => {
    consoleLogSpy = sinon.spy(console, 'log');

    optSearch(queryMock);
    setTimeout(() => {
      expect(consoleLogSpy).to.have.been.calledWith(chalk.blue('Searching for "arg1 arg2" on Google'));
      console.log.restore();
      done();
    }, 300);
  });
});
