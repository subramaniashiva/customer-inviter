const customerModelFactory = require('./customerModel');
const { expect } = require('chai');

describe('customerModel', () => {
  const InvalidCustomerError = class extends Error { };

  const setup = ({ isValidCustomerId,
    isValidCustomerName,
    isValidLatitude,
    isValidLongitude } = {}) => {
    const dependencies = {
      InvalidCustomerError,
      isValidCustomerId: isValidCustomerId || sinon.stub().returns(true),
      isValidLatitude: isValidLatitude || sinon.stub().returns(true),
      isValidLongitude: isValidLongitude || sinon.stub().returns(true),
      isValidCustomerName: isValidCustomerName || sinon.stub().returns(true),
    }

    const customerModel = customerModelFactory(dependencies);

    return {
      customerModel,
      dependencies,
    }
  }

  describe('when a customer object is not passed', () => {
    it('throws a TypeError', () => {
      const { customerModel } = setup();

      return expect(() => customerModel()).to.throw(
        TypeError, 'customerObject must be a valid object');
    });
  });

  describe('when a customer object is passed', () => {
    describe('when the customerId is invalid', () => {
      it('throws an InvalidCustomerError', () => {
        const isValidCustomerId = sinon.stub().returns(false);
        const { customerModel, dependencies } = setup({ isValidCustomerId });

        return expect(() => customerModel({ user_id: 'invalid id' })).to.throw(
          dependencies.InvalidCustomerError, 'customer object is invalid');
      });
    });

    describe('when the customerName is invalid', () => {
      it('throws an InvalidCustomerError', () => {
        const isValidCustomerName = sinon.stub().returns(false);
        const { customerModel, dependencies } = setup({ isValidCustomerName });

        return expect(() => customerModel({ name: 'invalid name' })).to.throw(
          dependencies.InvalidCustomerError, 'customer object is invalid');
      });
    });

    describe('when the latitude is invalid', () => {
      it('throws an InvalidCustomerError', () => {
        const isValidLatitude = sinon.stub().returns(false);
        const { customerModel, dependencies } = setup({ isValidLatitude });

        return expect(() => customerModel({ latitude: 'invalid lat' })).to.throw(
          dependencies.InvalidCustomerError, 'customer object is invalid');
      });
    });

    describe('when the longitude is invalid', () => {
      it('throws an InvalidCustomerError', () => {
        const isValidLongitude = sinon.stub().returns(false);
        const { customerModel, dependencies } = setup({ isValidLongitude });

        return expect(() => customerModel({ longitude: 'invalid long' })).to.throw(
          dependencies.InvalidCustomerError, 'customer object is invalid');
      });
    });

    describe('when all the customer details are valid', () => {
      it('returns customer object', () => {
        const customerObj = {
          user_id: 1,
          name: 'siva',
          latitude: '90',
          longitude: '180',
        }
        const { customerModel } = setup();

        return expect(customerModel(customerObj)).to.eql(customerObj);
      });
    });
  });
});
