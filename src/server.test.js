const serverFactory = require('./server');

describe('server', () => {
  const { stub, reset: resetSandbox, restore } = sinon.createSandbox();

  const setup = ({ getCustomerData, constants, logger } = {}) => {
    const dependencies = {
      getCustomerData: getCustomerData || stub().resolves('some-data'),
      constants: constants || {
        CUSTOMER_DATA_URL: 'http://some-url',
      },
      logger: logger || {
        error: stub(),
      }
    }

    const server = serverFactory(dependencies);

    return {
      server,
      dependencies,
    }
  }

  after(() => {
    resetSandbox();
  });

  describe('start', () => {
    it('gets customer data', async () => {
      const { server, dependencies } = setup();

      await server.start();

      return expect(dependencies.getCustomerData).to.have.been.calledOnceWithExactly({ customerDataUrl: dependencies.constants.CUSTOMER_DATA_URL });
    });

    describe('when there is an error in getting customer data', () => {
      before(() => stub(process, 'exit'));

      after(restore);

      it('exits the process', async () => {
        const getCustomerData = stub().rejects(new Error('some error'));
        const { server } = setup({ getCustomerData });

        await server.start();

        return expect(process.exit).to.have.been.calledOnceWith(1);
      });
    });
  });
});
