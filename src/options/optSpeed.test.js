/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import chalk from 'chalk';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import rewire from 'rewire';

const optSpeed = rewire('./optSpeed');

chai.use(sinonChai);

const wait = t => new Promise(r => setTimeout(r, t));

let consoleStub;

const dataMock = {
  speeds: {
    download: 999,
    upload: 999,
  },
  server: {
    ping: 999,
  },
};

function speedTestMock() {
  const obj = { on: () => {} };
  sinon.stub(obj, 'on')
    .withArgs('data', sinon.match.func)
    .callsArgWith(1, dataMock)
    .withArgs('error', sinon.match.func)
    .callsArgWith(1, 'error');
  return obj;
}

describe('optSpeed', () => {
  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should log to user internet speeds', async () => {
    optSpeed.__set__('speedTest', speedTestMock);
    optSpeed();

    await wait(300);

    expect(consoleStub).to.have.been.calledWith(`\nDownload ${chalk.green(999)} Mbps`);
    expect(consoleStub).to.have.been.calledWith(`Upload ${chalk.blue(999)} Mbps`);
    expect(consoleStub).to.have.been.calledWith(`Ping ${chalk.blue(999)} ms`);
  });

  it('should log error message if some problem occurs', async () => {
    optSpeed.__set__('speedTest', speedTestMock);

    optSpeed();

    await wait(300);

    expect(consoleStub).to.have.been.calledWith('An error ocurred');
  });
});
