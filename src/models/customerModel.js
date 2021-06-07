module.exports = ({
  InvalidCustomerError,
  isValidCustomerId,
  isValidCustomerName,
  isValidLatitude,
  isValidLongitude }) => (customerObject) => {
    if (!customerObject || typeof customerObject !== 'object') {
      throw new TypeError('customerObject must be a valid object');
    }

    const validCustomerRules = [{
      validator: isValidCustomerId,
      customerObjectKey: 'user_id',
      validatorParamName: 'customerId'
    }, {
      validator: isValidCustomerName,
      customerObjectKey: 'name',
      validatorParamName: 'name'
    }, {
      validator: isValidLatitude,
      customerObjectKey: 'latitude',
      validatorParamName: 'latitude'
    }, {
      validator: isValidLongitude,
      customerObjectKey: 'longitude',
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
      user_id: customerObject.user_id,
      name: customerObject.name,
      latitude: customerObject.latitude,
      longitude: customerObject.longitude,
    }
  };
