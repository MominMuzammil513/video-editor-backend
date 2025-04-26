// src/api/schemas/video.schema.js (updated for new schema)
import { body, param } from 'express-validator';

export const videoValidations = {
  trim: [
    param('id').isInt().withMessage('ID must be an integer'),
    body('startTime').matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Invalid start time format (HH:mm:ss)'),
    body('endTime').matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Invalid end time format (HH:mm:ss)'),
  ],
  subtitles: [
    param('id').isInt().withMessage('ID must be an integer'),
    body('text').isString().notEmpty().withMessage('Subtitle text is required'),
    body('startTime').matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Invalid start time format (HH:mm:ss)'),
    body('endTime').matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Invalid end time format (HH:mm:ss)'),
  ],
  render: [
    param('id').isInt().withMessage('ID must be an integer'),
  ],
  download: [
    param('id').isInt().withMessage('ID must be an integer'),
  ],
};