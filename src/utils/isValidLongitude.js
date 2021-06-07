module.exports = ({ isValidNumber }) => ({ longitude }) =>
  isValidNumber({ number: longitude }) &&
  Number(longitude) >= -180 &&
  Number(longitude) <= 180;
