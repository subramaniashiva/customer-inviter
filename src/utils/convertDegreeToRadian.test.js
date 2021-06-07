const convertDegreeToRadianFactory = require('./convertDegreeToRadian');

describe('convertDegreeToRadian', () => {
  const setup = ({ isValidNumber } = {}) => {
    const dependecies = {
      isValidNumber: isValidNumber || sinon.stub().returns(true),
    };

    const convertDegreeToRadian = convertDegreeToRadianFactory(dependecies);

    return {
      convertDegreeToRadian,
      dependecies,
    };
  }

  describe('when degree is not a valid number', () => {
    it('throws a TypeError', () => {
      const isValidNumber = sinon.stub().returns(false);

      const { convertDegreeToRadian } = setup({ isValidNumber });

      return expect(() => convertDegreeToRadian({ degree: 'invalid' })).to.throw(
        TypeError,
        'degree must be a valid number',
      );
    });
  });

  describe('when degree is a valid number', () => {
    it('converts it into radians', () => {
      const { convertDegreeToRadian } = setup();

      return expect(convertDegreeToRadian({
        degree: 53
      })).to.equal(0.9250245035569946);
    });
  });
});
