const isValidCustomerIdFactory = require('./isValidCustomerId');

describe('isValidCustomerId', () => {
  const setup = () => {
    return {
      isValidCustomerId: isValidCustomerIdFactory(),
    }
  }

  describe('when the customer id is invalid', () => {
    [null, undefined, {}, 123.45, false, '', '     ', '123.45', 0, '0'].forEach(customerId => {
      it('returns false', () => {
        const { isValidCustomerId } = setup();

        return expect(isValidCustomerId({ customerId })).to.be.false;
      });
    });
  });

  describe('when the customer id is valid', () => {
    [1, 100, 834737].forEach(customerId => {
      it('returns true', () => {
        const { isValidCustomerId } = setup();

        return expect(isValidCustomerId({ customerId })).to.be.true;
      });
    });
  });
});
