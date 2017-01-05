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

let consoleSpy;

describe('optSpeed', () => {
  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');

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
          if (event === 'error') {
            const error = 'someError';
            callback(error);
          }
        },
      };
    };

    optSpeed.__set__('speedTest', speedTestMock);
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should log to user internet speeds', (done) => {
    optSpeed();
    setTimeout(() => {
      expect(consoleSpy).to.have.been.calledWith(`
Download ${chalk.green(999)} Mbps
Upload ${chalk.blue(999)} Mbps
Ping ${chalk.blue(999)} ms
`);
      done();
    }, 300);
  });

  xit('should log error message if some problem occurs', (done) => {
    optSpeed();
    setTimeout(() => {
      expect(consoleSpy).to.have.been.calledWith(`
An error ocurred
`);
      done();
    }, 300);
  });
});
