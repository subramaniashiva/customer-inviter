module.exports = ({ readRemoteFile, logger }) => async ({ customerDataUrl }) => {
  try {
    const fileContents = await readRemoteFile({ filePathUrl: customerDataUrl });
    logger.info({ fileContents }, 'file read successfully');
    return fileContents;
  } catch (err) {
    logger.error({ err }, 'Error while getting customer data');
    throw err;
  }
}