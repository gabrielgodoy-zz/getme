'use strict';

/* eslint-disable no-unused-expressions */

var chalk = require('chalk');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
var childProcess = require('child_process');
var optSearch = require('./optSearch');

var expect = chai.expect;
chai.use(sinonChai);

var queryMock = void 0;
var childProcessStub = void 0;
var consoleLogSpy = void 0;

describe('optSearch', function () {
  beforeEach(function () {
    queryMock = ['arg1', 'arg2'];

    consoleLogSpy = sinon.spy(console, 'log');
    // Stub to prevent exec() from opening the browser while testing
    childProcessStub = sinon.stub(childProcess, 'exec');
  });

  afterEach(function () {
    childProcess.exec.restore();
    console.log.restore();
  });

  it('Should call child_process.exec with correct search URL', function (done) {
    var queryGoogle = 'https://www.google.com/search?q=';
    optSearch(queryMock);
    setTimeout(function () {
      expect(childProcessStub).to.have.been.calledWith('open ' + queryGoogle + queryMock.join('+'));
      done();
    }, 300);
  });

  it('Should log Searching message to user', function (done) {
    optSearch(queryMock);
    setTimeout(function () {
      expect(consoleLogSpy).to.have.been.calledWith(chalk.blue('Searching for "arg1 arg2" on Google'));
      done();
    }, 300);
  });
});