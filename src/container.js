const { promises: fsPromises } = require('fs');
const { createContainer, asValue, asFunction } = require('awilix');
const bunyan = require('bunyan');
const axios = require('axios');
const { URL } = require('url');

const package = require('../package.json');
const readRemoteFile = require('./utils/readRemoteFile');
const logger = require('./utils/logger');
const isValidUrl = require('./utils/isValidUrl');
const isValidCustomerId = require('./utils/isValidCustomerId');
const isValidCustomerName = require('./utils/isValidCustomerName');
const isValidLatitude = require('./utils/isValidLatitude');
const isValidLongitude = require('./utils/isValidLongitude');
const isValidNumber = require('./utils/isValidNumber');
const getGreatCircleDistance = require('./utils/getGreatCircleDistance');
const convertDegreeToRadian = require('./utils/convertDegreeToRadian');

const server = require('./server');
const getCustomerData = require('./getCustomerData');
const constants = require('./constants');
const customerModel = require('./models/customerModel');
const getInvitableCustomers = require('./getInvitableCustomers');
const InvalidCustomerError = require('./errors/InvalidCustomerError');

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
  isValidCustomerId: asFunction(isValidCustomerId),
  isValidCustomerName: asFunction(isValidCustomerName),
  isValidLatitude: asFunction(isValidLatitude),
  isValidLongitude: asFunction(isValidLongitude),
  isValidNumber: asFunction(isValidNumber),
  getGreatCircleDistance: asFunction(getGreatCircleDistance),
  convertDegreeToRadian: asFunction(convertDegreeToRadian),
});

container.register({
  InvalidCustomerError: asValue(InvalidCustomerError),
});

container.register({
  getCustomerData: asFunction(getCustomerData),
  server: asFunction(server).singleton(),
  constants: asFunction(constants),
  customerModel: asFunction(customerModel),
  getInvitableCustomers: asFunction(getInvitableCustomers),
});

module.exports = container.cradle;
