const readRemoteFileFactory = require('./readRemoteFile');

describe('readRemoteFile', () => {
  const setup = ({ axios, isValidUrl } = {}) => {
    const dependencies = {
      axios: axios || {
        get: sinon.stub().resolves({ data: 'file content' }),
      },
      isValidUrl: isValidUrl || sinon.stub().returns(true),
    };
    const readRemoteFile = readRemoteFileFactory(dependencies);

    return {
      readRemoteFile,
      dependencies,
    };
  };

  describe('when file path url is not provided', () => {
    it('throws a TypeError', () => {
      const { readRemoteFile } = setup();

      return expect(readRemoteFile()).to.eventually.be.rejectedWith(
        TypeError, 'filePathUrl must be a valid url');
    });
  });

  describe('when the file path url is not a string', () => {
    [{
      filePath: true,
      description: 'boolean'
    }, {
      filePath: {},
      description: 'object'
    }, {
      filePath: 1,
      description: 'number'
    }, {
      filePath: null,
      description: 'null'
    }, {
      filePath: undefined,
      description: 'undefined'
    }].forEach(({ filePathUrl, description }) => {
      describe(`when the file path url is ${description}`, () => {
        it('throws a TypeError', () => {
          const { readRemoteFile } = setup();

          return expect(readRemoteFile({ filePathUrl })).to.eventually.be.rejectedWith(TypeError, 'filePathUrl must be a valid url');
        });
      });
    });
  });

  describe('when file path url is invalid', () => {
    it('throws a TypeError', () => {
      const isValidUrl = sinon.stub().returns(false);
      const { readRemoteFile } = setup({ isValidUrl });
      const invalidFilePathUrl = 'some-invalid-path';

      return expect(readRemoteFile({ filePathUrl: invalidFilePathUrl })).to.eventually.be.rejectedWith(
        TypeError, 'filePathUrl must be a valid url');
    });
  });

  describe('when the file path url is valid', () => {
    it('calls axios to get the file contents', async () => {
      const { readRemoteFile, dependencies } = setup();

      const filePathUrl = 'some-path';
      await readRemoteFile({ filePathUrl });

      return expect(dependencies.axios.get)
        .to.have.been.calledOnceWithExactly(filePathUrl);
    });

    describe('when the call to axios succeeds', () => {
      it('returns the file content', async () => {
        const expectedFileContent = 'Some text';
        const axios = {
          get: sinon.stub().resolves({ data: expectedFileContent }),
        };
        const { readRemoteFile } = setup({ axios });

        const actualFileContent = await readRemoteFile({ filePathUrl: 'some-path' });

        return expect(actualFileContent).to.equal(expectedFileContent);
      });
    });

    describe('when the call to axios fails', () => {
      it('rejects with an error', () => {
        const error = new Error('Error while reading file');
        const axios = {
          get: sinon.stub().rejects(error),
        };
        const { readRemoteFile } = setup({ axios });

        return expect(readRemoteFile({ filePathUrl: 'some-path' })).to.eventually.be.rejectedWith(
          Error, 'Error while reading file');
      });
    });
  });
});
