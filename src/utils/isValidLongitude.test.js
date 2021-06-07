const isValidLongitudeFactory = require('./isValidLongitude');

describe('isValidLongitude', () => {
  const setup = ({ isValidNumber } = {}) => {
    const dependencies = {
      isValidNumber: isValidNumber || sinon.stub().returns(true),
    }

    const isValidLongitude = isValidLongitudeFactory(dependencies);

    return {
      isValidLongitude,
      dependencies,
    }
  }

  describe('when the Longitude is not a valid number', () => {
    it('returns false', () => {
      const isValidNumber = sinon.stub().returns(false);
      const { isValidLongitude } = setup({ isValidNumber });

      return expect(isValidLongitude({ Longitude: 'abc' })).to.be.false;
    });
  });

  describe('when the number is less than -180', () => {
    it('returns false', () => {
      const { isValidLongitude } = setup();

      return expect(isValidLongitude({ Longitude: '-181' })).to.be.false;
    });
  });

  describe('when the number is greater than 180', () => {
    it('returns false', () => {
      const { isValidLongitude } = setup();

      return expect(isValidLongitude({ Longitude: '181' })).to.be.false;
    });
  });

  describe('when the number is between -180 and +180', () => {
    ['-180', '-179', '180', '179', 180, -180, 179, -179, '-34.56', '153.78'].forEach((longitude) => {
      it('returns true', () => {
        const { isValidLongitude } = setup();

        return expect(isValidLongitude({ longitude })).to.be.true;
      });
    })
  });
});
