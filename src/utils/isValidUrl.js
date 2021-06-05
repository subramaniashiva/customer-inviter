module.exports = ({ URL }) => ({ urlString }) => {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}