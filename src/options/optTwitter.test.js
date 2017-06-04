/* eslint-disable no-unused-expressions */
/* eslint no-underscore-dangle: ["error", { "allow": ["__set__"] }] */

import moxios from 'moxios';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import chalk from 'chalk';
import rewire from 'rewire';

const optTwitter = rewire('./optTwitter');

chai.use(sinonChai);

const responseMock = {
  statuses: [
    {
      user: { name: 'test_user' },
      text: 'test_tweet',
      created_at: 'test',
    },
  ],
};

let consoleStub;
let fakeGetAccessToken;

describe('optTwitter', () => {
  beforeEach(() => {
    fakeGetAccessToken = sinon.stub().returns('fake_token');
    optTwitter.__set__({ getAccessToken: fakeGetAccessToken });
    moxios.install();
    consoleStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    moxios.uninstall();
    console.log.restore();
  });

  it('should console log tweets', async () => {
    optTwitter(['test', 'test2']);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: responseMock });

    expect(fakeGetAccessToken).to.have.been.called;
    expect(consoleStub).to.have.been.calledWith(`${chalk.yellow('From:')} test_user`);
    expect(consoleStub).to.have.been.calledWith(`${chalk.yellow('Tweet:')} test_tweet`);
    expect(consoleStub).to.have.been.calledWith(`${chalk.yellow('Time:')} test\n`);
  });
});
