module.exports = ({ getCustomerData, constants, getGreatCircleDistance, logger }) =>
  async ({
    customerDataUrl,
    maxDistanceInKms = constants.MAX_CUSTOMER_DISTANCE_KMS,
    sort = {
      key: constants.CUSTOMER_DATA_KEYS.USER_ID,
      sortOrder: constants.SORT_ORDER.ASCENDING,
    }
  }) => {
    try {
      // Get customer data
      const totalCustomersList = await getCustomerData({ customerDataUrl });

      const latitude1 = constants.OFFICE_COORDINATES.DUBLIN.LATITUDE;
      const longitude1 = constants.OFFICE_COORDINATES.DUBLIN.LONGITUDE;

      // Filter customers living within maxDistanceInKms
      const filteredCustomers = totalCustomersList.reduce((result, customer) => {
        try {
          getGreatCircleDistance({
            latitude1,
            longitude1,
            latitude2: Number(customer.latitude),
            longitude2: Number(customer.longitude)
          }) <= maxDistanceInKms ? result.push({
            user_id: customer.user_id,
            name: customer.name,
          }): null;
        } catch (err) {
          logger.error({ err }, 'error while getting distance');
          throw new Error(err.message);
        }
        return result;
      }, []);

      const customerDataKeys = Object.values(constants.CUSTOMER_DATA_KEYS);
      const sortOrderKeys = Object.values(constants.SORT_ORDER);

      // Sort the filtered list and return
      if (customerDataKeys.indexOf(sort.key) !== -1 &&
        sortOrderKeys.indexOf(sort.sortOrder) !== -1) {
        return filteredCustomers.sort((customer1, customer2) => {
          if (sort.sortOrder === constants.SORT_ORDER.ASCENDING) {
            return customer1[sort.key] > customer2[sort.key] ? 1 : -1;
          }
          return customer1[sort.key] < customer2[sort.key] ? 1 : -1;
        });
      } else {
        logger.error('Invalid sort object provided. Returning unsorted customers', { sort });
        return filteredCustomers;
      }
    } catch (err) {
      logger.error({ err }, 'error while getting invitable customers');
      throw err;
    }
  }
