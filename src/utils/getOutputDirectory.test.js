const getOutputDirectoryFactory = require('./getOutputDirectory');
const { expect } = require('chai');

describe('getOutputDirectory', () => {
  const setup = () => {
    return {
      getOutputDirectory: getOutputDirectoryFactory(),
    }
  }

  describe('when the env is test', () => {
    const { NODE_ENV } = process.env;

    before(() => {
      process.env.NODE_ENV = 'test';
    });

    after(() => {
      process.env.NODE_ENV = NODE_ENV;
    });

    it('returns test output directory name', () => {
      const { getOutputDirectory } = setup();
  
      return expect(getOutputDirectory()).to.equal('./.test-output');
    });
  });
  
  describe('when the env is not test', () => {
    const { NODE_ENV } = process.env;

    before(() => {
      process.env.NODE_ENV = 'prod';
    });

    after(() => {
      process.env.NODE_ENV = NODE_ENV;
    });

    it('returns output directory name', () => {
      const { getOutputDirectory } = setup();
  
      return expect(getOutputDirectory()).to.equal('./output');
    });
  });
});
