module.exports = ({ getCustomerData, constants, getGreatCircleDistance, logger }) =>
  async ({ customerDataUrl, maxDistanceInKms = constants.MAX_CUSTOMER_DISTANCE_KMS }) => {
    try {
      const totalCustomersList = await getCustomerData({ customerDataUrl });
      const latitude1 = constants.OFFICE_COORDINATES.DUBLIN.LATITUDE;
      const longitude1 = constants.OFFICE_COORDINATES.DUBLIN.LONGITUDE;
      return totalCustomersList.filter(({ latitude: latitude2, longitude: longitude2 }) => {
        try {
          return getGreatCircleDistance({
            latitude1,
            longitude1,
            latitude2: Number(latitude2),
            longitude2: Number(longitude2)
          }) <= maxDistanceInKms;
        } catch (err) {
          logger.error({ err }, 'error while getting distance');
          throw new Error(err.message);
        }
      });
    } catch (err) {
      logger.error({ err }, 'Error while getting invitable customers');
      throw err;
    }
  }
