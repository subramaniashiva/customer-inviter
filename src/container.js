const { promises: fsPromises } = require('fs');
const { createContainer, asValue } = require('awilix');

const container = createContainer();

container.register({
  fsPromises: asValue(fsPromises),
});

module.exports = container.cradle;
