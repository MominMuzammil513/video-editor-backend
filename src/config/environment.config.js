// src/config/environment.config.js (ensure this exists)
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  nodeEnv: process.env.NODE_ENV || 'development',
};
