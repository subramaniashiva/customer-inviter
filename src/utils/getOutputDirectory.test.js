const getOutputDirectoryFactory = require('./getOutputDirectory');
const { expect } = require('chai');

describe('getOutputDirectory', () => {
  const setup = () => {
    return {
      getOutputDirectory: getOutputDirectoryFactory(),
    }
  }

  it('returns output directory name', () => {
    const { getOutputDirectory } = setup();

    return expect(getOutputDirectory()).to.equal('./output');
  });
});
