// src/utils/file.util.js (updated with renameFile)
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/environment.config.js';

export class FileUtil {
  async writeFile(filePath, content) {
    await fs.writeFile(filePath, content);
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  async renameFile(oldPath, newPath) {
    await fs.rename(oldPath, newPath);
  }

  generateOutputPath(originalName, prefix) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return path.join(
      config.uploadDir,
      `${prefix}-${uniqueSuffix}-${originalName}`
    );
  }

  generateSubtitlePath() {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return path.join(config.uploadDir, `subtitle-${uniqueSuffix}.srt`);
  }
}