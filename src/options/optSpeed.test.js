/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

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

    const speedTestMock = () => {
    };

    optSpeed.__set__('speedTest', speedTestMock);
  });

  afterEach(() => {
    console.log.restore();
  });

  xit('should log to user internet speeds', (done) => {
    optSpeed();
    setTimeout(() => {
      expect(consoleSpy).to.have.been.called;
      done();
    }, 300);
  });
});
