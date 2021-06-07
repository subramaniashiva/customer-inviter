const getInvitableCustomersFactory = require('./getInvitableCustomers');
const { expect } = require('chai');

describe('getInvitableCustomers', () => {
  const setup = ({
    getCustomerData,
    constants,
    getGreatCircleDistance,
    logger } = {}) => {
    const dependencies = {
      getCustomerData: getCustomerData || sinon.stub().resolves([]),
      constants: constants || {
        OFFICE_COORDINATES: {
          DUBLIN: {
            LATITUDE: '12',
            LONGITUDE: '12',
          }
        },
        MAX_CUSTOMER_DISTANCE_KMS: 100,
      },
      logger: logger || {
        error: sinon.stub(),
      },
      getGreatCircleDistance: getGreatCircleDistance || sinon.stub(),
    };

    const getInvitableCustomers = getInvitableCustomersFactory(dependencies);

    return {
      getInvitableCustomers,
      dependencies,
    };
  }

  it('gets the customer data', () => {
    const { getInvitableCustomers, dependencies } = setup();
    const customerDataUrl = 'http://some-url';

    getInvitableCustomers({ customerDataUrl });

    return expect(
      dependencies.getCustomerData
    ).to.have.been.calledOnceWithExactly({ customerDataUrl });
  });

  describe('when there is an error in getting customer data', () => {
    it('throws the error', () => {
      const errorMessage = 'Error while getting customer data';
      const error = new Error(errorMessage);
      const getCustomerData = sinon.stub().rejects(error);
      const { getInvitableCustomers } = setup({ getCustomerData });

      return expect(getInvitableCustomers({
        customerDataUrl: 'some-url'
      })).to.eventually.be.rejectedWith(
        Error, errorMessage);
    });
  });

  describe('when there is no error in getting customer data', () => {
    it('finds great circle distance per row of customer data', async () => {
      const customerData = [{
        latitude: '1',
        longitude: '1',
      }, {
        latitude: '2',
        longitude: '2',
      }];
      const getCustomerData = sinon.stub().resolves(customerData);
      const { getInvitableCustomers, dependencies } = setup({ getCustomerData });

      await getInvitableCustomers({ customerDataUrl: 'some-url' });

      const latitude1 = dependencies.constants.OFFICE_COORDINATES.DUBLIN.LATITUDE;
      const longitude1 = dependencies.constants.OFFICE_COORDINATES.DUBLIN.LONGITUDE;
      expect(dependencies.getGreatCircleDistance.getCall(0).args[0]).to.eql({
        latitude1,
        longitude1,
        latitude2: Number(customerData[0].latitude),
        longitude2: Number(customerData[0].longitude),
      });
      expect(dependencies.getGreatCircleDistance.getCall(1).args[0]).to.eql({
        latitude1,
        longitude1,
        latitude2: Number(customerData[1].latitude),
        longitude2: Number(customerData[1].longitude),
      });
      return expect(dependencies.getGreatCircleDistance.callCount).to.equal(2);
    });

    describe('when there is an error in finding great circle distance', () => {
      it('throws the error', () => {
        const errorMessage = 'Error computing distance';
        const error = new Error(errorMessage);
        const getGreatCircleDistance = sinon.stub().throws(error);
        const customerData = [{
          latitude: '1',
          longitude: '1',
        }, {
          latitude: '2',
          longitude: '2',
        }];
        const getCustomerData = sinon.stub().resolves(customerData);
        const { getInvitableCustomers } = setup({
          getGreatCircleDistance,
          getCustomerData
        });

        return expect(getInvitableCustomers({
          customerDataUrl: 'some-url'
        })).to.eventually.be.rejectedWith(Error, errorMessage);
      });
    });

    describe('when there is no error in finding great circle distance', () => {
      describe('when no distance filter is given', () => {
        it('returns the customers who are within MAX_CUSTOMER_DISTANCE_KMS', async () => {
          const customerData = [{
            latitude: '1',
            longitude: '1',
          }, {
            latitude: '2',
            longitude: '2',
          }];
          const getCustomerData = sinon.stub().resolves(customerData);
          const getGreatCircleDistance = sinon.stub()
          getGreatCircleDistance.onCall(0).returns(200)
          getGreatCircleDistance.onCall(1).returns(50);
          const { getInvitableCustomers } = setup({ getCustomerData, getGreatCircleDistance });

          const selectedCustomers = await getInvitableCustomers({ customerDataUrl: 'some-url' });

          return expect(selectedCustomers).to.eql([customerData[1]]);
        });
      });

      describe('when distance filter is given', () => {
        it('returns the customers who are within distance given', async () => {
          const customerData = [{
            latitude: '1',
            longitude: '1',
          }, {
            latitude: '2',
            longitude: '2',
          }];
          const getCustomerData = sinon.stub().resolves(customerData);
          const getGreatCircleDistance = sinon.stub()
          getGreatCircleDistance.onCall(0).returns(200)
          getGreatCircleDistance.onCall(1).returns(50);
          const { getInvitableCustomers } = setup({ getCustomerData, getGreatCircleDistance });

          const selectedCustomers = await getInvitableCustomers({ customerDataUrl: 'some-url', maxDistanceInKms: 200 });

          return expect(selectedCustomers).to.eql(customerData);
        });
      });
    });
  });
});
