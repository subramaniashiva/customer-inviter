const InvalidCustomerError = require('./InvalidCustomerError');

describe('InvalidCustomerError', () => {
  it('inherits from Error', () =>
    expect(new InvalidCustomerError()).to.be.an.instanceof(Error));

  it('has the correct name', () =>
    expect(new InvalidCustomerError().name).to.eql('InvalidCustomerError'));

  it('returns the expected message', () => {
    const errorMessage = 'customer invalid';

    return expect(new InvalidCustomerError(errorMessage).message).to.eql(errorMessage);
  });

  it('returns the given errors', () => {
    const expectedInvalidCustomerError = new Error('Some error happened');

    return expect(
      new InvalidCustomerError('', expectedInvalidCustomerError).originalErr,
    ).to.eql(expectedInvalidCustomerError);
  });
});
