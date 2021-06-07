const isValidCustomerNameFactory = require('./isValidCustomerName');

describe('isValidCustomerName', () => {
  const setup = () => {
    return {
      isValidCustomerName: isValidCustomerNameFactory(),
    }
  }

  describe('when the customer name is invalid', () => {
    [null, undefined, {}, 123, false, '', '     '].forEach(name => {
      it('returns false', () => {
        const { isValidCustomerName } = setup();

        return expect(isValidCustomerName({ name })).to.be.false;
      });
    });
  });

  describe('when the customer name is valid', () => {
    ['siva', 'some long name with spaces'].forEach(name => {
      it('returns true', () => {
        const { isValidCustomerName } = setup();

        return expect(isValidCustomerName({ name })).to.be.true;
      });
    });
  });
});
