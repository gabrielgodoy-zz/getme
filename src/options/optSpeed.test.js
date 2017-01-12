/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

const chalk = require('chalk');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const rewire = require('rewire');

const optSpeed = rewire('./optSpeed');
const expect = chai.expect;
chai.use(sinonChai);

let consoleStub;

describe('optSpeed', () => {
  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should log to user internet speeds', (done) => {
    const speedTestMock = function speedTestMock() {
      return {
        on: (event, callback) => {
          if (event === 'data') {
            const data = {
              speeds: {
                download: 999,
                upload: 999,
              },
              server: {
                ping: 999,
              },
            };
            callback(data);
          }
        },
      };
    };
    optSpeed.__set__('speedTest', speedTestMock);
    optSpeed();
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(`\nDownload ${chalk.green(999)} Mbps`);
      expect(consoleStub).to.have.been.calledWith(`Upload ${chalk.blue(999)} Mbps`);
      expect(consoleStub).to.have.been.calledWith(`Ping ${chalk.blue(999)} ms`);
      done();
    }, 300);
  });

  it('should log error message if some problem occurs', (done) => {
    const speedTestMock = function speedTestMock() {
      return {
        on: (event, callback) => {
          if (event === 'error') {
            callback('error');
          }
        },
      };
    };
    optSpeed.__set__('speedTest', speedTestMock);

    optSpeed();
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith('An error ocurred');
      done();
    }, 300);
  });
});
