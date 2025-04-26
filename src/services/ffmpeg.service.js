// src/services/ffmpeg.service.js (updated to handle cleanup)
import ffmpeg from 'fluent-ffmpeg';
import { FileUtil } from '../utils/file.util.js';
import { logger } from '../utils/logger.util.js';

export class FFmpegService {
  constructor(fileUtil = new FileUtil()) {
    this.fileUtil = fileUtil;
  }

  async trimVideo(inputPath, outputPath, start, end) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(this.calculateDuration(start, end))
        .output(outputPath)
        .on('end', () => {
          logger.info(`Video trimmed successfully: ${outputPath}`);
          resolve();
        })
        .on('error', (error) => {
          logger.error(`FFmpeg trim error: ${error.message}`);
          reject(error);
        })
        .run();
    });
  }

  async addSubtitles(inputPath, outputPath, text, start, end) {
    const subtitleFile = this.fileUtil.generateSubtitlePath();
    const srtContent = `1\n${start} --> ${end}\n${text}\n`;
    await this.fileUtil.writeFile(subtitleFile, srtContent);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([`-vf subtitles=${subtitleFile}`])
        .output(outputPath)
        .on('end', async () => {
          await this.fileUtil.deleteFile(subtitleFile);
          logger.info(`Subtitles added successfully: ${outputPath}`);
          resolve();
        })
        .on('error', (error) => {
          logger.error(`FFmpeg subtitles error: ${error.message}`);
          reject(error);
        })
        .run();
    });
  }

  calculateDuration(start, end) {
    const startSeconds = this.timeToSeconds(start);
    const endSeconds = this.timeToSeconds(end);
    if (endSeconds <= startSeconds) {
      throw new Error('End time must be after start time');
    }
    return endSeconds - startSeconds;
  }

  timeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}