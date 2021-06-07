module.exports = ({ bunyan, package }) => (
  bunyan.createLogger({
    name: package.name,
    serializers: {
      err: bunyan.stdSerializers.err
    }
  })
);
