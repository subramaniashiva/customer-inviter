const getCustomerDataFactory = require('./getCustomerData');
const { expect } = require('chai');

describe('getCustomerData', () => {
  const setup = ({ readRemoteFile, logger } = {}) => {
    const fileContents = 'some-content';

    const dependencies = {
      readRemoteFile: readRemoteFile || sinon.stub().resolves(fileContents),
      logger: logger || {
        info: sinon.stub(),
        error: sinon.stub(),
      }
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
    it('returns the file contents', async () => {
      const customerDataUrl = 'http://some-url';
      const { fileContents, getCustomerData } = setup();

      const actualFileContents = await getCustomerData({ customerDataUrl });

      return expect(actualFileContents).to.equal(fileContents)
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