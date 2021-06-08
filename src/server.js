module.exports = ({
  constants,
  getInvitableCustomers,
  logger,
  writeToFile,
  getOutputDirectory
}) => {
  return {
    // Do server initialization stuff here.
    // Currently it calls the method to get the input file and writes the output to a file.
    // Can be extended to other initializations in future if needed.
    start: async function () {
      try {
        const selectedCustomers = await getInvitableCustomers({
          customerDataUrl: constants.CUSTOMER_DATA_URL,
          maxDistanceInKms: constants.MAX_CUSTOMER_DISTANCE_KMS
        });
        logger.info({ selectedCustomers });

        const fileContents = selectedCustomers.map(JSON.stringify).join("\n");
        await writeToFile({
          directory: getOutputDirectory(),
          fileName: `/inviteList${constants.MAX_CUSTOMER_DISTANCE_KMS}Kms.txt`,
          data: fileContents
        });
      } catch (err) {
        logger.error({ err }, 'Error while getting invitable customers list');
        process.exit(1);
      }
    },
    stop: function () {
      logger.info('Doing cleanups if any and exiting gracefully');
      process.exit(0);
    }
  };
};
