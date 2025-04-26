// src/config/database.config.js
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.util.js';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query}`);
  logger.debug(`Params: ${e.params}`);
  logger.debug(`Duration: ${e.duration}ms`);
});

// src/config/environment.config.js
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  nodeEnv: process.env.NODE_ENV || 'development',
};