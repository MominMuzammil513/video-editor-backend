// src/api/routes/index.js
import videoRoutes from './video.routes.js';

export const configureRoutes = (app) => {
  app.use('/api/videos', videoRoutes);
};

// src/api/schemas/video.schema.js
import { body, param } from 'express-validator';

export const videoValidations = {
  trim: [
    param('id').isInt().withMessage('ID must be an integer'),
    body('start').matches(/^(\d{2}):(\d{2}):(\d{2})$/).withMessage('Invalid start time format'),
    body('end').matches(/^(\d{2}):(\d{2}):(\d{2})$/).withMessage('Invalid end time format'),
  ],
  subtitles: [
    param('id').isInt().withMessage('ID must be an integer'),
    body('text').isString().notEmpty().withMessage('Subtitle text is required'),
    body('start').matches(/^(\d{2}):(\d{2}):(\d{2})$/).withMessage('Invalid start time format'),
    body('end').matches(/^(\d{2}):(\d{2}):(\d{2})$/).withMessage('Invalid end time format'),
  ],
  render: [
    param('id').isInt().withMessage('ID must be an integer'),
  ],
  download: [
    param('id').isInt().withMessage('ID must be an integer'),
  ],
};