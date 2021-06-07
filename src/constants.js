module.exports = () => ({
  CUSTOMER_DATA_URL: 'https://s3.amazonaws.com/intercom-take-home-test/customers.txt',
  OFFICE_COORDINATES: {
    DUBLIN: {
      LATITUDE: 53.339428,
      LONGITUDE: -6.257664,
    }
  },
  EARTH_RADIUS_KMS: 6371,
  MAX_CUSTOMER_DISTANCE_KMS: 100,
  CUSTOMER_DATA_KEYS: {
    USER_ID: 'user_id',
    NAME: 'name',
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
  },
  SORT_ORDER: {
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
  },
});
