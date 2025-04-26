// src/api/middleware/error.middleware.js
import { logger } from '../../utils/logger.util.js';

export const errorMiddleware = (error, req, res, next) => {
  logger.error(`${error.name}: ${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};
