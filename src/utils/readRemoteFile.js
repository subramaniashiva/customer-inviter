module.exports = ({ axios, isValidUrl }) => async ({ filePathUrl } = {}) => {
  if (!filePathUrl || typeof filePathUrl !== 'string' || !isValidUrl({ urlString: filePathUrl })) {
    throw new TypeError('filePathUrl must be a valid url');
  }

  const { data } = await axios.get(filePathUrl);
  return data;
};
