/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const optTwitter = require('./optTwitter');


chai.use(sinonChai);
let queryMock;

describe('optTwitter', () => {
  beforeEach(() => {
    queryMock = ['arg1', 'arg2'];
    sinon.stub(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('Should call \' searchTwitter()\' and console log tweets', (done) => {
    optTwitter(queryMock);
    done();
  });
});
