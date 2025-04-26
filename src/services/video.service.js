// // src/services/video.service.js (updated for new schema)
// import { prisma } from '../config/database.config.js';
// import { FFmpegService } from './ffmpeg.service.js';
// import { FileUtil } from '../utils/file.util.js';
// import { logger } from '../utils/logger.util.js';
// import ffmpeg from 'fluent-ffmpeg';

// export class VideoService {
//   constructor(ffmpegService = new FFmpegService()) {
//     this.ffmpegService = ffmpegService;
//     this.fileUtil = new FileUtil();
//   }

//   async uploadVideo(file) {
//     if (!file) {
//       throw Object.assign(new Error('No file uploaded'), { status: 400 });
//     }

//     const duration = await this.getVideoDuration(file.path);

//     const video = await prisma.video.create({
//       data: {
//         name: file.originalname,
//         path: file.path,
//         size: BigInt(file.size),
//         duration,
//         status: 'UPLOADED',
//       },
//     });

//     return video;
//   }

//   async trimVideo(id, startTime, endTime) {
//     const video = await this.getVideo(id);
//     const order = await this.getNextOperationOrder(id);

//     const operation = await prisma.operation.create({
//       data: {
//         videoId: parseInt(id),
//         operationType: 'TRIM',
//         order,
//         trimOperation: {
//           create: {
//             startTime,
//             endTime,
//           },
//         },
//       },
//       include: { trimOperation: true },
//     });

//     await prisma.video.update({
//       where: { id: parseInt(id) },
//       data: { status: 'PROCESSING' },
//     });

//     return operation;
//   }

//   async addSubtitles(id, text, startTime, endTime) {
//     const video = await this.getVideo(id);
//     const order = await this.getNextOperationOrder(id);

//     const operation = await prisma.operation.create({
//       data: {
//         videoId: parseInt(id),
//         operationType: 'SUBTITLE',
//         order,
//         subtitleOperation: {
//           create: {
//             text,
//             startTime,
//             endTime,
//           },
//         },
//       },
//       include: { subtitleOperation: true },
//     });

//     await prisma.video.update({
//       where: { id: parseInt(id) },
//       data: { status: 'PROCESSING' },
//     });

//     return operation;
//   }

//   async renderVideo(id) {
//     const video = await this.getVideo(id);
//     const operations = await prisma.operation.findMany({
//       where: { videoId: parseInt(id) },
//       orderBy: { order: 'asc' },
//       include: {
//         trimOperation: true,
//         subtitleOperation: true,
//       },
//     });

//     const outputPath = this.fileUtil.generateOutputPath(video.name, 'rendered');
    
//     const render = await prisma.render.create({
//       data: {
//         videoId: parseInt(id),
//         outputPath,
//         status: 'PROCESSING',
//       },
//     });

//     try {
//       let inputPath = video.path;
//       let tempPath = inputPath;

//       for (const operation of operations) {
//         tempPath = this.fileUtil.generateOutputPath(video.name, `temp-${operation.id}`);
        
//         if (operation.operationType === 'TRIM' && operation.trimOperation) {
//           await this.ffmpegService.trimVideo(
//             inputPath,
//             tempPath,
//             operation.trimOperation.startTime,
//             operation.trimOperation.endTime
//           );
//         } else if (operation.operationType === 'SUBTITLE' && operation.subtitleOperation) {
//           await this.ffmpegService.addSubtitles(
//             inputPath,
//             tempPath,
//             operation.subtitleOperation.text,
//             operation.subtitleOperation.startTime,
//             operation.subtitleOperation.endTime
//           );
//         }

//         if (inputPath !== video.path) {
//           await this.fileUtil.deleteFile(inputPath);
//         }
//         inputPath = tempPath;
//       }

//       await this.fileUtil.renameFile(inputPath, outputPath);

//       await prisma.render.update({
//         where: { id: render.id },
//         data: { status: 'COMPLETED' },
//       });

//       await prisma.video.update({
//         where: { id: parseInt(id) },
//         data: { 
//           status: 'RENDERED',
//           path: outputPath,
//         },
//       });

//       return render;
//     } catch (error) {
//       await prisma.render.update({
//         where: { id: render.id },
//         data: { status: 'FAILED' },
//       });
//       throw error;
//     }
//   }

//   async getVideoForDownload(id) {
//     const render = await prisma.render.findFirst({
//       where: {
//         videoId: parseInt(id),
//         status: 'COMPLETED',
//       },
//       orderBy: { createdAt: 'desc' },
//       include: { video: true },
//     });

//     if (!render) {
//       throw Object.assign(new Error('No completed render found'), { status: 404 });
//     }

//     return { path: render.outputPath, name: render.video.name };
//   }

//   async getVideo(id) {
//     const video = await prisma.video.findUnique({
//       where: { id: parseInt(id) },
//     });
//     if (!video) {
//       throw Object.assign(new Error('Video not found'), { status: 404 });
//     }
//     return video;
//   }

//   async getNextOperationOrder(videoId) {
//     const lastOperation = await prisma.operation.findFirst({
//       where: { videoId: parseInt(videoId) },
//       orderBy: { order: 'desc' },
//     });
//     return (lastOperation?.order || 0) + 1;
//   }

//   async getVideoDuration(filePath) {
//     return new Promise((resolve, reject) => {
//       ffmpeg.ffprobe(filePath, (err, metadata) => {
//         if (err) {
//           logger.warn(`Failed to extract duration: ${err.message}`);
//           resolve(null);
//         } else {
//           resolve(metadata.format.duration);
//         }
//       });
//     });
//   }
// }
// src/services/video.service.js
import { prisma } from '../config/database.config.js';
import { FFmpegService } from './ffmpeg.service.js';
import { FileUtil } from '../utils/file.util.js';
import { logger } from '../utils/logger.util.js';
import ffmpeg from 'fluent-ffmpeg';

export class VideoService {
  constructor(ffmpegService = new FFmpegService()) {
    this.ffmpegService = ffmpegService;
    this.fileUtil = new FileUtil();
  }

  async uploadVideo(file) {
    if (!file) {
      throw Object.assign(new Error('No file uploaded'), { status: 400 });
    }

    const duration = await this.getVideoDuration(file.path);

    const video = await prisma.video.create({
      data: {
        name: file.originalname,
        path: file.path,
        size: BigInt(file.size), // Ensure BigInt for database
        duration,
        status: 'UPLOADED',
      },
    });

    // Convert BigInt to string for JSON serialization
    return {
      ...video,
      size: video.size.toString(), // Convert BigInt to string
    };
  }

  async trimVideo(id, startTime, endTime) {
    const video = await this.getVideo(id);
    const order = await this.getNextOperationOrder(id);

    const operation = await prisma.operation.create({
      data: {
        videoId: parseInt(id),
        operationType: 'TRIM',
        order,
        trimOperation: {
          create: {
            startTime,
            endTime,
          },
        },
      },
      include: { trimOperation: true },
    });

    await prisma.video.update({
      where: { id: parseInt(id) },
      data: { status: 'PROCESSING' },
    });

    return operation;
  }

  async addSubtitles(id, text, startTime, endTime) {
    const video = await this.getVideo(id);
    const order = await this.getNextOperationOrder(id);

    const operation = await prisma.operation.create({
      data: {
        videoId: parseInt(id),
        operationType: 'SUBTITLE',
        order,
        subtitleOperation: {
          create: {
            text,
            startTime,
            endTime,
          },
        },
      },
      include: { subtitleOperation: true },
    });

    await prisma.video.update({
      where: { id: parseInt(id) },
      data: { status: 'PROCESSING' },
    });

    return operation;
  }

  async renderVideo(id) {
    const video = await this.getVideo(id);
    const operations = await prisma.operation.findMany({
      where: { videoId: parseInt(id) },
      orderBy: { order: 'asc' },
      include: {
        trimOperation: true,
        subtitleOperation: true,
      },
    });

    const outputPath = this.fileUtil.generateOutputPath(video.name, 'rendered');

    const render = await prisma.render.create({
      data: {
        videoId: parseInt(id),
        outputPath,
        status: 'PROCESSING',
      },
    });

    try {
      let inputPath = video.path;
      let tempPath = inputPath;

      for (const operation of operations) {
        tempPath = this.fileUtil.generateOutputPath(video.name, `temp-${operation.id}`);

        if (operation.operationType === 'TRIM' && operation.trimOperation) {
          await this.ffmpegService.trimVideo(
            inputPath,
            tempPath,
            operation.trimOperation.startTime,
            operation.trimOperation.endTime
          );
        } else if (operation.operationType === 'SUBTITLE' && operation.subtitleOperation) {
          await this.ffmpegService.addSubtitles(
            inputPath,
            tempPath,
            operation.subtitleOperation.text,
            operation.subtitleOperation.startTime,
            operation.subtitleOperation.endTime
          );
        }

        if (inputPath !== video.path) {
          await this.fileUtil.deleteFile(inputPath);
        }
        inputPath = tempPath;
      }

      await this.fileUtil.renameFile(inputPath, outputPath);

      await prisma.render.update({
        where: { id: render.id },
        data: { status: 'COMPLETED' },
      });

      await prisma.video.update({
        where: { id: parseInt(id) },
        data: {
          status: 'RENDERED',
          path: outputPath,
        },
      });

      return render;
    } catch (error) {
      await prisma.render.update({
        where: { id: render.id },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  }

  async getVideoForDownload(id) {
    const render = await prisma.render.findFirst({
      where: {
        videoId: parseInt(id),
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
      include: { video: true },
    });

    if (!render) {
      throw Object.assign(new Error('No completed render found'), { status: 404 });
    }

    return { path: render.outputPath, name: render.video.name };
  }

  async getVideo(id) {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });
    if (!video) {
      throw Object.assign(new Error('Video not found'), { status: 404 });
    }
    return video;
  }

  async getNextOperationOrder(videoId) {
    const lastOperation = await prisma.operation.findFirst({
      where: { videoId: parseInt(videoId) },
      orderBy: { order: 'desc' },
    });
    return (lastOperation?.order || 0) + 1;
  }

  async getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          logger.warn(`Failed to extract duration: ${err.message}`);
          resolve(null);
        } else {
          resolve(metadata.format.duration);
        }
      });
    });
  }
}