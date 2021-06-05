module.exports = ({ getCustomerData, constants, logger }) => {
  return {
    start: async function () {
      try {
        await getCustomerData({ customerDataUrl: constants.CUSTOMER_DATA_URL });
      } catch (err) {
        logger.error({ err }, 'Error while getting customer data');
        process.exit(1);
      }
    }
  }
};
