const serverFactory = require('./server');

describe('server', () => {
  const { stub, reset: resetSandbox, restore } = sinon.createSandbox();

  const setup = ({ getInvitableCustomers, constants, logger } = {}) => {
    const dependencies = {
      getInvitableCustomers: getInvitableCustomers || stub().resolves('some-data'),
      constants: constants || {
        CUSTOMER_DATA_URL: 'http://some-url',
        MAX_CUSTOMER_DISTANCE_KMS: 100,
      },
      logger: logger || {
        error: stub(),
        info: stub(),
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
    it('gets invitable customers', async () => {
      const { server, dependencies } = setup();

      await server.start();

      return expect(dependencies.getInvitableCustomers).
        to.have.been.calledOnceWithExactly({
          customerDataUrl: dependencies.constants.CUSTOMER_DATA_URL,
          maxDistanceInKms: dependencies.constants.MAX_CUSTOMER_DISTANCE_KMS
        });
    });

    describe('when there is an error in getting invitable data', () => {
      before(() => stub(process, 'exit'));

      after(restore);

      it('exits the process', async () => {
        const getInvitableCustomers = stub().rejects(new Error('some error'));
        const { server } = setup({ getInvitableCustomers });

        await server.start();

        return expect(process.exit).to.have.been.calledOnceWith(1);
      });
    });
  });
});
