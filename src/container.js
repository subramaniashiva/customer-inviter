const { promises: fsPromises } = require('fs');
const { createContainer, asValue, asFunction } = require('awilix');
const bunyan = require('bunyan');
const axios = require('axios');
const { URL } = require('url');

const package = require('../package.json');
const readRemoteFile = require('./utils/readRemoteFile');
const logger = require('./utils/logger');
const isValidUrl = require('./utils/isValidUrl');

const server = require('./server');
const getCustomerData = require('./getCustomerData');
const constants = require('./constants');

const container = createContainer();

/* External dependencies */
container.register({
  fsPromises: asValue(fsPromises),
  bunyan: asValue(bunyan),
  axios: asValue(axios),
  URL: asValue(URL),
});

/* Utils */
container.register({
  readRemoteFile: asFunction(readRemoteFile),
  package: asValue(package),
  logger: asFunction(logger).singleton(),
  isValidUrl: asFunction(isValidUrl),
});

container.register({
  getCustomerData: asFunction(getCustomerData),
  server: asFunction(server).singleton(),
  constants: asFunction(constants),
})

module.exports = container.cradle;
