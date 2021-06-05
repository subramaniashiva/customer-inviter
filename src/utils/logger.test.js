const loggerFactory = require('./logger');
const { expect } = require('chai');

describe('logger', () => {
  const setup = ({ bunyan, package } = {}) => {
    const dependencies = {
      bunyan: bunyan || {
        createLogger: sinon.stub(),
      },
      package: {
        name: 'package-name',
      }
    }
    const logger = loggerFactory(dependencies);

    return {
      logger,
      dependencies,
    }
  }

  it('creates logger using bunyan with the name from package', () => {
    const { dependencies } = setup();

    return expect(dependencies.bunyan.createLogger).to.have.been.calledOnceWithExactly({
      name: dependencies.package.name
    });
  });

  it('returns logger instance', () => {
    const expectedLoggerInstance = {
      info: sinon.stub(),
      error: sinon.stub(),
    };
    const bunyan = {
      createLogger: sinon.stub().returns(expectedLoggerInstance)
    }
    const { logger } = setup({ bunyan });

    return expect(logger).to.eql(expectedLoggerInstance)
  });
});