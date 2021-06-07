const { server, logger } = require('./src/container');

// process.on('SIGTERM', server.stop);
// process.on('SIGINT', server.stop);
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'Encountered unhandled exception');
  process.exit(1);
});
process.on('unhandledRejection', (err, origin) => {
  logger.fatal({ err, origin }, 'Encountered unhandled rejection');
});

server.start();
