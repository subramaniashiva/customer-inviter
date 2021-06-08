const writeToFileFactory = require('./writeToFile');
const { expect } = require('chai');

describe('writeToFile', () => {
  const setup = ({ fsPromises, logger } = {}) => {
    const dependencies = {
      fsPromises: fsPromises || {
        mkdir: sinon.stub().resolves(),
        writeFile: sinon.stub().resolves()
      },
      logger: logger || {
        info: sinon.stub()
      }
    };

    const writeToFile = writeToFileFactory(dependencies);

    return {
      writeToFile,
      dependencies
    };
  };

  [
    {
      description: 'when the directory is not given',
      params: {
        fileName: 'some-file.txt',
        data: 'some-text'
      },
      errorMessage: 'directory must be a string'
    },
    {
      description: 'when the directory is not a string',
      params: {
        directory: {},
        fileName: 'some-file.txt',
        data: 'some-text'
      },
      errorMessage: 'directory must be a string'
    },
    {
      description: 'when the fileName is not given',
      params: {
        directory: 'some-dir',
        data: 'some-text'
      },
      errorMessage: 'fileName must be a string'
    },
    {
      description: 'when the fileName is not a string',
      params: {
        directory: 'some-dir',
        fileName: {},
        data: 'some-text'
      },
      errorMessage: 'fileName must be a string'
    }
  ].forEach(({ description, params, errorMessage }) => {
    describe(description, () => {
      it('throws a type error', () => {
        const { writeToFile } = setup();

        return expect(writeToFile(params)).to.eventually.be.rejectedWith(
          TypeError,
          errorMessage
        );
      });
    });
  });

  it('creates the directory if it does not exist', async () => {
    const { writeToFile, dependencies } = setup();
    const directory = 'some-dir';

    await writeToFile({
      directory,
      fileName: 'some-file.txt',
      data: 'some-data'
    });

    return expect(dependencies.fsPromises.mkdir).to.have.calledOnceWithExactly(
      directory,
      { recursive: true }
    );
  });

  it('writes the data to the file', async () => {
    const { writeToFile, dependencies } = setup();
    const data = 'some-data';
    const directory = 'some-dir';
    const fileName = 'some-file';

    await writeToFile({
      directory,
      fileName,
      data
    });

    return expect(
      dependencies.fsPromises.writeFile
    ).to.have.calledOnceWithExactly(`${directory}${fileName}`, data);
  });

  describe('when there is an error in writing file', () => {
    it('throws an error', () => {
      const errorMessage = 'Write failed';
      const error = new Error(errorMessage);
      const fsPromises = {
        mkdir: sinon.stub().resolves(),
        writeFile: sinon.stub().rejects(error)
      };
      const { writeToFile } = setup({ fsPromises });

      return expect(
        writeToFile({
          directory: 'some-dir',
          fileName: 'some-file',
          data: 'some-data'
        })
      ).to.eventually.be.rejectedWith(Error, errorMessage);
    });
  });
});
