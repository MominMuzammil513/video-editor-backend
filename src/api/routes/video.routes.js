// src/api/routes/video.routes.js
import { Router } from 'express';
import { VideoController } from '../controllers/video.controller.js';
import { validate } from '../middleware/validator.middleware.js';
import { videoValidations } from '../schemas/video.schema.js';
import multer from 'multer';
import { config } from '../../config/environment.config.js';

const storage = multer.diskStorage({
  destination: config.uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mov'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

const router = Router();
const videoController = new VideoController();

router.post(
  '/upload',
  upload.single('video'),
  videoController.uploadVideo
);

router.post(
  '/:id/trim',
  validate(videoValidations.trim),
  videoController.trimVideo
);

router.post(
  '/:id/subtitles',
  validate(videoValidations.subtitles),
  videoController.addSubtitles
);

router.post(
  '/:id/render',
  validate(videoValidations.render),
  videoController.renderVideo
);

router.get(
  '/:id/download',
  validate(videoValidations.download),
  videoController.downloadVideo
);

export default router;