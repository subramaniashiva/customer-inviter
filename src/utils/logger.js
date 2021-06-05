module.exports = ({ bunyan, package }) => (
  bunyan.createLogger({ name: package.name })
)