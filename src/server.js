import app from './app.js';
import { prisma } from './config/database.config.js';
import { logger } from './utils/logger.util.js';
import { config } from './config/environment.config.js';

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Successfully connected to PostgreSQL');

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
  process.exit(1);
});

startServer();