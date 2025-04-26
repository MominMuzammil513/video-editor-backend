import express from 'express';
import { configureRoutes } from './api/routes/index.js';
import { errorMiddleware } from './api/middleware/error.middleware.js';
import { logger } from './utils/logger.util.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configureRoutes(app);
app.use(errorMiddleware);

app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not Found' });
});

export default app;