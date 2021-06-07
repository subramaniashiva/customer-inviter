module.exports = ({
  constants,
  InvalidCustomerError,
  isValidCustomerId,
  isValidCustomerName,
  isValidLatitude,
  isValidLongitude }) => (customerObject) => {
    if (!customerObject || typeof customerObject !== 'object') {
      throw new TypeError('customerObject must be a valid object');
    }
    const { USER_ID, NAME, LATITUDE, LONGITUDE } = constants.CUSTOMER_DATA_KEYS;

    const validCustomerRules = [{
      validator: isValidCustomerId,
      customerObjectKey: USER_ID,
      validatorParamName: 'customerId'
    }, {
      validator: isValidCustomerName,
      customerObjectKey: NAME,
      validatorParamName: 'name'
    }, {
      validator: isValidLatitude,
      customerObjectKey: LATITUDE,
      validatorParamName: 'latitude'
    }, {
      validator: isValidLongitude,
      customerObjectKey: LONGITUDE,
      validatorParamName: 'longitude'
    }];

    const isCustomerObjectValid = validCustomerRules.every(({
      customerObjectKey, validator, validatorParamName }
    ) => {
      return validator({ [validatorParamName]: customerObject[customerObjectKey] });
    });

    if (!isCustomerObjectValid) {
      throw new InvalidCustomerError('customer object is invalid');
    }

    return {
      [USER_ID]: customerObject[USER_ID],
      [NAME]: customerObject[NAME],
      [LATITUDE]: customerObject[LATITUDE],
      [LONGITUDE]: customerObject[LONGITUDE],
    }
  };
