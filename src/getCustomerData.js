module.exports = ({ readRemoteFile, logger, customerModel }) => async ({ customerDataUrl }) => {
  try {
    const rawfileContents = await readRemoteFile({ filePathUrl: customerDataUrl });
    const customerDataArray = rawfileContents.split('\n').reduce((modelledArray, row) => {
      try {
        const parsedRow = JSON.parse(row);
        const customer = customerModel(parsedRow);
        modelledArray.push(customer);
      } catch (err) {
        logger.error({ err, row }, 'Error while parsing a row in customer data');
      }
      return modelledArray;
    }, []);
    logger.info('file read successfully');
    return customerDataArray;
  } catch (err) {
    logger.error({ err }, 'Error while getting customer data');
    throw err;
  }
}
