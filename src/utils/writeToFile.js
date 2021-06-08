module.exports =
  ({ fsPromises, logger }) =>
    async ({ directory, fileName, data }) => {
      if (!directory || typeof directory !== 'string') {
        throw new TypeError('directory must be a string');
      }

      if (!fileName || typeof fileName !== 'string') {
        throw new TypeError('fileName must be a string');
      }

      await fsPromises.mkdir(directory, { recursive: true }).catch(logger.info);

      await fsPromises.writeFile(`${directory}${fileName}`, data);
    };
