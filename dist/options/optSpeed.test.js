'use strict';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

var chalk = require('chalk');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
var rewire = require('rewire');

var optSpeed = rewire('./optSpeed');
var expect = chai.expect;
chai.use(sinonChai);

var consoleStub = void 0;

describe('optSpeed', function () {
  beforeEach(function () {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  it('should log to user internet speeds', function (done) {
    var speedTestMock = function speedTestMock() {
      return {
        on: function on(event, callback) {
          if (event === 'data') {
            var data = {
              speeds: {
                download: 999,
                upload: 999
              },
              server: {
                ping: 999
              }
            };
            callback(data);
          }
        }
      };
    };
    optSpeed.__set__('speedTest', speedTestMock);
    optSpeed();
    setTimeout(function () {
      expect(consoleStub).to.have.been.calledWith('\nDownload ' + chalk.green(999) + ' Mbps');
      expect(consoleStub).to.have.been.calledWith('Upload ' + chalk.blue(999) + ' Mbps');
      expect(consoleStub).to.have.been.calledWith('Ping ' + chalk.blue(999) + ' ms');
      done();
    }, 300);
  });

  it('should log error message if some problem occurs', function (done) {
    var speedTestMock = function speedTestMock() {
      return {
        on: function on(event, callback) {
          if (event === 'error') {
            callback('error');
          }
        }
      };
    };
    optSpeed.__set__('speedTest', speedTestMock);

    optSpeed();
    setTimeout(function () {
      expect(consoleStub).to.have.been.calledWith('An error ocurred');
      done();
    }, 300);
  });
});