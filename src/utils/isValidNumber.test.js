const isValidNumberFactory = require('./isValidNumber');

describe('isValidNumber', () => {
  const setup = () => {
    const isValidNumber = isValidNumberFactory();

    return {
      isValidNumber,
    }
  };

  describe('when the number is valid', () => {
    [
      '1',
      '123',
      '678.45',
      '-123',
      '-45.9568392',
      '3.5',
      '0.001',
      '-0.000001',
      '.123',
      '0',
      '-9'
    ].forEach((number) => {
      it('returns true', () => {
        const { isValidNumber } = setup();

        return expect(isValidNumber({ number })).to.be.true;
      });
    })
  });

  describe('when the number is invalid', () => {
    [
      '123e',
      '678.45.12',
      '-123.12.12',
      'abc',
      '',
      '   ',
      '123e456',
      '.45.34'
    ].forEach((number) => {
      it('returns false', () => {
        const { isValidNumber } = setup();

        return expect(isValidNumber({ number })).to.be.false;
      });
    })
  });
});
