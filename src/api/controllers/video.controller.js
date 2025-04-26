// src/api/controllers/video.controller.js (updated for new schema)
import { VideoService } from '../../services/video.service.js';
import { logger } from '../../utils/logger.util.js';

export class VideoController {
  constructor(videoService = new VideoService()) {
    this.videoService = videoService;
  }

  uploadVideo = async (req, res, next) => {
    try {
      const video = await this.videoService.uploadVideo(req.file);
      logger.info(`Video uploaded: ${video.id}`);
      res.status(201).json(video);
    } catch (error) {
      next(error);
    }
  };

  trimVideo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { startTime, endTime } = req.body;
      const operation = await this.videoService.trimVideo(id, startTime, endTime);
      logger.info(`Trim operation created for video: ${id}`);
      res.json(operation);
    } catch (error) {
      next(error);
    }
  };

  addSubtitles = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { text, startTime, endTime } = req.body;
      const operation = await this.videoService.addSubtitles(id, text, startTime, endTime);
      logger.info(`Subtitle operation created for video: ${id}`);
      res.json(operation);
    } catch (error) {
      next(error);
    }
  };

  renderVideo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const render = await this.videoService.renderVideo(id);
      logger.info(`Render started for video: ${id}`);
      res.json(render);
    } catch (error) {
      next(error);
    }
  };

  downloadVideo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { path, name } = await this.videoService.getVideoForDownload(id);
      logger.info(`Video downloaded: ${id}`);
      res.download(path, name);
    } catch (error) {
      next(error);
    }
  };
}