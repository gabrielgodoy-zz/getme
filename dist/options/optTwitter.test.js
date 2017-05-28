'use strict';

/* eslint-disable no-unused-expressions */

var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
var optTwitter = require('./optTwitter');

chai.use(sinonChai);
var queryMock = void 0;

describe('optTwitter', function () {
  beforeEach(function () {
    queryMock = ['arg1', 'arg2'];
    sinon.stub(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  it('Should call \' searchTwitter()\' and console log tweets', function (done) {
    optTwitter(queryMock);
    done();
  });
});