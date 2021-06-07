module.exports = ({ isValidNumber }) => ({ latitude }) =>
  isValidNumber({ number: latitude }) &&
  Number(latitude) >= -90 &&
  Number(latitude) <= 90;
