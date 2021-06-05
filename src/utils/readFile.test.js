const readFileFactory = require('./readFile');

describe('readFile', () => {
  const setup = ({ fsPromises } = {}) => {
    const dependencies = {
      fsPromises: fsPromises || {
        readFile: sinon.stub().resolves('file content'),
      },
    };
    const readFile = readFileFactory(dependencies);

    return {
      readFile,
      dependencies,
    };
  };

  describe('when file path is not provided', () => {
    it('throws a TypeError', () => {
      const { readFile } = setup();

      return expect(readFile()).to.eventually.be.rejectedWith(
        TypeError, 'filePath must be a valid string');
    });
  });

  describe('when the file path is invalid', () => {
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
    }].forEach(({ filePath, description }) => {
      describe(`when the file path is ${description}`, () => {
        it('throws a TypeError', () => {
          const { readFile } = setup();

          return expect(readFile(filePath)).to.eventually.be.rejectedWith(TypeError, 'filePath must be a valid string');
        });
      });
    });
  });

  describe('when the file path is valid', () => {
    it('calls promisified version of readFile from file system', async () => {
      const { readFile, dependencies } = setup();

      const filePath = 'some-path';
      await readFile(filePath);

      return expect(dependencies.fsPromises.readFile)
        .to.have.been.calledOnceWithExactly(filePath);
    });

    describe('when the call to file system\'s readFile succeeds', () => {
      it('returns the file content', async () => {
        const expectedFileContent = 'Some text';
        const fsPromises = {
          readFile: sinon.stub().resolves(expectedFileContent),
        };
        const { readFile } = setup({ fsPromises });

        const actualFileContent = await readFile('some-path');

        return expect(actualFileContent).to.equal(expectedFileContent);
      });
    });

    describe('when the call to file system\'s readFile fails', () => {
      it('rejects with an error', () => {
        const error = new Error('Error while reading file');
        const fsPromises = {
          readFile: sinon.stub().rejects(error),
        };
        const { readFile } = setup({ fsPromises });

        return expect(readFile()).to.eventually.be.rejectedWith(
          Error, 'filePath must be a valid string');
      });
    });
  });
});
