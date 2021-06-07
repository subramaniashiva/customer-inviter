module.exports = ({ constants, getInvitableCustomers, logger }) => {
  return {
    start: async function () {
      try {
        const selectedCustomers = await getInvitableCustomers({
          customerDataUrl: constants.CUSTOMER_DATA_URL,
          maxDistanceInKms: constants.MAX_CUSTOMER_DISTANCE_KMS
        });
        logger.info({ selectedCustomers });
      } catch (err) {
        logger.error({ err }, 'Error while getting invitable customers list');
        process.exit(1);
      }
    }
  }
};
