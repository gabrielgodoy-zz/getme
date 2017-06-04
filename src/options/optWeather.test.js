/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

import moxios from 'moxios';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import rewire from 'rewire';
import {
  forecastResponseMock,
  weatherResponseMock,
} from '../../stubs/weather';

const optWeather = rewire('./optWeather');

chai.use(sinonChai);

let consoleStub;
let commanderMock;
let responseAPIMock;
let responseAddressMock;

describe('optWeather', () => {
  beforeEach(() => {
    moxios.install();
    responseAPIMock = { ip: '179.215.28.27' }; // Response is valid JSON

    moxios.stubRequest('https://api.ipify.org?format=json', { status: 200, response: responseAPIMock });

    responseAddressMock = {
      city: 'Niterói',
      country: 'Brazil',
      countryCode: 'BR',
      lat: -22.9021,
      lon: -43.1303,
    };

    moxios.stubRequest(`http://ip-api.com/json/${responseAPIMock.ip}`, { status: 200, response: responseAddressMock });

    consoleStub = sinon.stub(console, 'log');
    commanderMock = {};
  });

  afterEach(() => {
    moxios.uninstall();
    console.log.restore();
  });

  it('should log weather', async () => {
    commanderMock.name = () => 'weather';
    optWeather(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: weatherResponseMock });

    expect(consoleStub).to.have.been.calledWithMatch(/Niterói, Brazil | Wed Jan 04 2017/);
    expect(consoleStub).to.have.been.calledWithMatch(/30.57 °C/);
    expect(consoleStub).to.have.been.calledWithMatch(/28 °C/);
    expect(consoleStub).to.have.been.calledWithMatch(/33 °C/);
  });

  it('should log forecast', async () => {
    commanderMock.name = () => 'forecast';
    optWeather(commanderMock);

    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: forecastResponseMock });

    forecastResponseMock.list
      .forEach((item) => {
        const { temp, temp_min: tempMin, temp_max: tempMax } = item.main;
        if (new Date(item.dt).getHours() === 12) {
          expect(consoleStub).to.have.been.calledWithMatch(temp);
          expect(consoleStub).to.have.been.calledWithMatch(tempMin);
          expect(consoleStub).to.have.been.calledWithMatch(tempMax);
        } else {
          expect(consoleStub).not.to.have.been.calledWithMatch(temp);
          expect(consoleStub).not.to.have.been.calledWithMatch(tempMin);
          expect(consoleStub).not.to.have.been.calledWithMatch(tempMax);
        }
      });
  });

  it('should use fahrenheit', async () => {
    commanderMock.name = () => 'forecast';
    commanderMock.fahrenheit = true;

    optWeather(commanderMock);
    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: forecastResponseMock });

    expect(consoleStub).to.have.been.calledWithMatch(/27.2 °F/);
  });

  it('should use celsius', async () => {
    commanderMock.name = () => 'forecast';
    commanderMock.celsius = true;

    optWeather(commanderMock);
    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: forecastResponseMock });

    expect(consoleStub).to.have.been.calledWithMatch(/27.2 °C/);
  });

  it('should use kelvin', async () => {
    commanderMock.name = () => 'forecast';
    commanderMock.kelvin = true;

    optWeather(commanderMock);
    await new Promise(resolve => moxios.wait(resolve));
    const request = moxios.requests.mostRecent();
    await request.respondWith({ status: 200, response: forecastResponseMock });

    expect(consoleStub).to.have.been.calledWithMatch(/27.2 K/);
  });
});
