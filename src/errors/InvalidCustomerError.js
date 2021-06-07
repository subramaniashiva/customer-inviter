module.exports = class InvalidCustomerError extends Error {
  constructor(message, originalErr) {
    super(message);
    this.name = 'InvalidCustomerError';
    this.originalErr = originalErr;
  }
};
