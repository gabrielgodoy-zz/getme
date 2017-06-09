const chalk = require('chalk');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const optDate = require('./optDate');
const sinon = require('sinon');

const expect = chai.expect;
chai.use(sinonChai);

let consoleStub;

describe('optDate', () => {
  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });
  afterEach(() => {
    console.log.restore();
  });
  it('Should add 2 days', (done) => {
    const date = '2017-05-01';
    const sDate = '(Mon) 2017-05-01';
    const sNewDate = '(Wed) 2017-05-03';
    optDate(2, {
      date,
    });
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(`\nInformed date: ${chalk.yellow(sDate)}`);
      expect(consoleStub).to.have.been.calledWith(`Calculated Date: ${chalk.yellow(sNewDate)}`);
      done();
    }, 300);
  });
  it('Should add 4 months', (done) => {
    const date = '2017-05-01';
    const sDate = '(Mon) 2017-05-01';
    const sNewDate = '(Fri) 2017-09-01';
    optDate(4, {
      date,
      period: 'M',
    });
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(`\nInformed date: ${chalk.yellow(sDate)}`);
      expect(consoleStub).to.have.been.calledWith(`Calculated Date: ${chalk.yellow(sNewDate)}`);
      done();
    }, 300);
  });
  it('Should subtract 35 days', (done) => {
    const date = '2017-05-01';
    const sDate = '(Mon) 2017-05-01';
    const sNewDate = '(Mon) 2017-03-27';
    optDate(35, {
      date,
      subtract: true,
    });
    setTimeout(() => {
      expect(consoleStub).to.have.been.calledWith(`\nInformed date: ${chalk.yellow(sDate)}`);
      expect(consoleStub).to.have.been.calledWith(`Calculated Date: ${chalk.yellow(sNewDate)}`);
      done();
    }, 300);
  });
});
