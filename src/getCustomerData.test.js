const getCustomerDataFactory = require('./getCustomerData');
const { expect } = require('chai');

describe('getCustomerData', () => {
  const setup = ({ readRemoteFile, logger, customerModel } = {}) => {
    const fileContents = 'some-content';

    const dependencies = {
      readRemoteFile: readRemoteFile || sinon.stub().resolves(fileContents),
      logger: logger || {
        info: sinon.stub(),
        error: sinon.stub(),
      },
      customerModel: customerModel || sinon.stub().returns({}),
    }

    const getCustomerData = getCustomerDataFactory(dependencies);

    return {
      getCustomerData,
      dependencies,
      fileContents,
    }
  }

  it('calls a function to read remote file with the customer data url', async () => {
    const customerDataUrl = 'http://some-url';
    const { dependencies, getCustomerData } = setup();

    await getCustomerData({ customerDataUrl });

    return expect(dependencies.readRemoteFile).to.have.been.calledOnceWithExactly({ filePathUrl: customerDataUrl });
  });

  describe('when the call to read remote file succeeds', () => {
    it('parses and models the customer data per row', async () => {
      const customerDataUrl = 'http://some-url';
      const row1 = {
        key1: 'value1',
      };
      const row2 = {
        key2: 'value2',
      };
      const fileContents = `${JSON.stringify(row1)}\n${JSON.stringify(row2)}`;
      const readRemoteFile = sinon.stub().resolves(fileContents);
      const { getCustomerData, dependencies } = setup({ readRemoteFile });

      await getCustomerData({ customerDataUrl });

      expect(dependencies.customerModel.getCall(0).args[0]).to.eql(row1);
      expect(dependencies.customerModel.getCall(1).args[0]).to.eql(row2);
      return expect(dependencies.customerModel.callCount).to.equal(2);
    });

    describe('when there is an error in modelling customer data', () => {
      it('logs an error for that row and continues processing', async () => {
        const customerDataUrl = 'http://some-url';
        const row1 = 'invalid row';
        const row2 = {
          key2: 'value2',
        };
        const fileContents = `${row1}\n${JSON.stringify(row2)}`;
        const readRemoteFile = sinon.stub().resolves(fileContents);
        const { getCustomerData, dependencies } = setup({ readRemoteFile });

        await getCustomerData({ customerDataUrl });

        expect(dependencies.logger.error).to.have.been.calledOnce;
        expect(dependencies.customerModel.getCall(0).args[0]).to.eql(row2);
        return expect(dependencies.customerModel.callCount).to.equal(1);
      });
    });

    describe('when the data is modelled successfully', () => {
      it('returns the modelled customer data array', async () => {
        const customerDataUrl = 'http://some-url';
        const row1 = {
          key1: 'value1',
        };
        const row2 = {
          key2: 'value2',
        };
        const fileContents = `${JSON.stringify(row1)}\n${JSON.stringify(row2)}`;
        const readRemoteFile = sinon.stub().resolves(fileContents);
        const customerModel = (model) => model;
        const { getCustomerData } = setup({ readRemoteFile, customerModel });

        const customerData = await getCustomerData({ customerDataUrl });

        return expect(customerData).to.eql([row1, row2]);
      });
    });
  });

  describe('when the call to read remote file fails', () => {
    it('throws the error', async () => {
      const customerDataUrl = 'http://some-url';
      const fileReadErrorMessage = 'Some error happened while reading file!';
      const fileReadError = new Error(fileReadErrorMessage);
      const readRemoteFile = sinon.stub().rejects(fileReadError);
      const { getCustomerData } = setup({ readRemoteFile });

      return expect(getCustomerData({ customerDataUrl })).to.eventually.be.rejectedWith(Error, fileReadErrorMessage);
    });
  });
});
