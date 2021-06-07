module.exports = ({ axios, isValidUrl, logger }) => async ({ filePathUrl } = {}) => {
  if (!filePathUrl || typeof filePathUrl !== 'string' || !isValidUrl({ urlString: filePathUrl })) {
    throw new TypeError('filePathUrl must be a valid url');
  }

  logger.info(`reading file from ${filePathUrl}`);
  const { data } = await axios.get(filePathUrl);
  return data;
};
