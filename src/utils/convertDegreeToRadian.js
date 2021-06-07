module.exports = ({ isValidNumber }) => ({ degree }) => {
  if (!isValidNumber({ number: degree })) {
    throw new TypeError('degree must be a valid number');
  }
  return degree * Math.PI / 180;
}
