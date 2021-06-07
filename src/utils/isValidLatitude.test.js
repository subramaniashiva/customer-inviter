const isValidLatitudeFactory = require('./isValidLatitude');

describe('isValidLatitude', () => {
  const setup = ({ isValidNumber } = {}) => {
    const dependencies = {
      isValidNumber: isValidNumber || sinon.stub().returns(true),
    }

    const isValidLatitude = isValidLatitudeFactory(dependencies);

    return {
      isValidLatitude,
      dependencies,
    }
  }

  describe('when the latitude is not a valid number', () => {
    it('returns false', () => {
      const isValidNumber = sinon.stub().returns(false);
      const { isValidLatitude } = setup({ isValidNumber });

      return expect(isValidLatitude({ latitude: 'abc' })).to.be.false;
    });
  });

  describe('when the number is less than -90', () => {
    it('returns false', () => {
      const { isValidLatitude } = setup();

      return expect(isValidLatitude({ latitude: '-91' })).to.be.false;
    });
  });

  describe('when the number is greater than 90', () => {
    it('returns false', () => {
      const { isValidLatitude } = setup();

      return expect(isValidLatitude({ latitude: '91' })).to.be.false;
    });
  });

  describe('when the number is between -90 and +90', () => {
    ['-90', '-89', '90', '89', 90, -90, 89, -89, '-8.456', '56.123456'].forEach((latitude) => {
      it('returns true', () => {
        const { isValidLatitude } = setup();

        return expect(isValidLatitude({ latitude })).to.be.true;
      });
    })
  });
});
