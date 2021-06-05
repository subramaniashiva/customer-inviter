const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

before(() => {
  global.expect = expect;
  global.sinon = sinon;
});
