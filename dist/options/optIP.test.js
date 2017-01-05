'use strict';

/* eslint-disable no-unused-expressions */

var nock = require('nock');
var os = require('os');
var chai = require('chai');
var chalk = require('chalk');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
var optIP = require('./optIP');

var expect = chai.expect;
chai.use(sinonChai);

var consoleSpy = void 0;
var responseMock = void 0;
var networkInterfacesMock = void 0;

describe('optIP', function () {
  beforeEach(function () {
    networkInterfacesMock = {
      lo0: [{
        address: '127.0.0.1',
        netmask: '255.0.0.0',
        family: 'IPv4',
        mac: '00:00:00:00:00:00',
        internal: true
      }, {
        address: '::1',
        netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
        family: 'IPv6',
        mac: '00:00:00:00:00:00',
        scopeid: 0,
        internal: true
      }, {
        address: 'fe80::1',
        netmask: 'ffff:ffff:ffff:ffff::',
        family: 'IPv6',
        mac: '00:00:00:00:00:00',
        scopeid: 1,
        internal: true
      }],
      en0: [{
        address: 'fe80::10db:a989:c30d:629',
        netmask: 'ffff:ffff:ffff:ffff::',
        family: 'IPv6',
        mac: '3c:15:c2:d1:8e:3e',
        scopeid: 4,
        internal: false
      }, {
        address: '192.168.0.21',
        netmask: '255.255.255.0',
        family: 'IPv4',
        mac: '3c:15:c2:d1:8e:3e',
        internal: false
      }],
      awdl0: [{
        address: 'fe80::409a:b7ff:fe03:69d2',
        netmask: 'ffff:ffff:ffff:ffff::',
        family: 'IPv6',
        mac: '42:9a:b7:03:69:d2',
        scopeid: 8,
        internal: false
      }]
    };
    responseMock = JSON.stringify({ ip: '179.215.28.27' }); // Response is valid JSON

    consoleSpy = sinon.spy(console, 'log');
    sinon.stub(os, 'networkInterfaces').returns(networkInterfacesMock);
  });

  afterEach(function () {
    os.networkInterfaces.restore();
    console.log.restore();
  });

  it('Should log correct IP addresses to user', function (done) {
    nock('https://api.ipify.org').get('/').query({ format: 'json' }) // GET Query for the API
    .reply(200, responseMock);

    optIP();
    setTimeout(function () {
      expect(consoleSpy).to.have.been.calledWith('\nPublic IP ' + chalk.blue('179.215.28.27') + '\nNetwork IP ' + chalk.blue('192.168.0.21') + '\n');
      done();
    }, 300);
  });

  it('Should log an error to user if API problem occurs', function (done) {
    nock('https://api.ipify.org').get('/').query({ format: 'json' }) // GET Query for the API
    .replyWithError('Error');

    optIP();
    setTimeout(function () {
      expect(consoleSpy).to.have.been.calledWith('It was not possible to retrieve your IP this time');
      done();
    }, 300);
  });
});