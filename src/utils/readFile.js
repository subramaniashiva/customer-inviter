module.exports = ({ fsPromises }) => async (filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new TypeError('filePath must be a valid string');
  }

  const fileContent = await fsPromises.readFile(filePath);
  return fileContent;
};
