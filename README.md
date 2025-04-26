// README.md (updated for schema and FFmpeg)
# Video Editing Platform Backend

## Overview
This is a professional, Dockerized backend for a web-based video editing platform. It provides API endpoints for uploading videos, applying editing operations (trimming, subtitles), rendering, and downloading processed videos, with a comprehensive Prisma schema for data management.

## Features
- Video upload with metadata storage
- Video trimming based on timestamps
- Subtitle overlay functionality
- Video rendering with operation history
- Processed video download
- Comprehensive error handling
- Structured logging
- Input validation
- Modular FFmpeg operations
- Dockerized PostgreSQL and Node.js services
- Enhanced Prisma schema with operation tracking

## Tech Stack
- Node.js
- Express.js
- PostgreSQL with Prisma ORM
- FFmpeg (via fluent-ffmpeg)
- Multer for file uploads
- Winston for logging
- Express-validator for input validation
- Docker and Docker Compose

## Prerequisites
- Docker
- Docker Compose
- npm (for local development outside Docker)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd video-editing-platform
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Ensure Docker is running on your system.

4. Build and start the services:
```bash
docker-compose up --build
```
This starts:
- The Node.js app on `http://localhost:3000`
- PostgreSQL on `localhost:5432`

5. Run Prisma migrations to set up the database:
```bash
docker-compose exec app npx prisma migrate dev
```

6. Test the API using Postman with the provided collection (`docs/VideoEditingAPI.postman_collection.json`).

7. To stop the services:
```bash
docker-compose down
```

## Database Schema
The Prisma schema (`prisma/schema.prisma`) includes:
- **Video**: Stores video metadata (name, path, size, duration, status).
- **Operation**: Tracks editing operations (trim, subtitle) with order and type.
- **TrimOperation**: Details for trim operations (start/end times).
- **SubtitleOperation**: Details for subtitle operations (text, start/end times).
- **Render**: Tracks render jobs and output paths.
- **Enums**: `VideoStatus` (UPLOADED, PROCESSING, etc.) and `OperationType` (TRIM, SUBTITLE).

## Development
For development with hot-reloading:
```bash
docker-compose up
```
The `nodemon` setup in `package.json` ensures the app restarts on code changes.

## API Documentation
API documentation is available in `docs/VideoEditingAPI.postman_collection.json`. Import this file into Postman to test the endpoints.

## Project Structure
```
src/
├── api/                    # API-related code
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── schemas/           # Validation schemas
├── config/                # Configuration files
├── services/             # Business logic
├── utils/                # Utility functions
├── app.js                # Express app configuration
├── server.js            # Server entry point
prisma/                  # Prisma schema and migrations
docs/                   # API documentation
uploads/                # Local storage for videos
```

## Logging
Logs are stored in the `logs/` directory:
- `error.log`: Error-level logs
- `combined.log`: All logs

## Error Handling
The application includes comprehensive error handling with:
- Custom error middleware
- Input validation
- Structured error responses
- Detailed logging

## Running Tests
Currently, integration tests are not implemented. To add tests, create a `tests/` directory and use a testing framework like Jest.

## Troubleshooting
- **Database Connection Issues**: Ensure Docker is running and the `db` service is healthy (`docker-compose ps`).
- **FFmpeg Errors**: FFmpeg is included in the Docker image. Verify with `docker-compose exec app ffmpeg -version`.
- **Port Conflicts**: If `3000` or `5432` are in use, update `docker-compose.yml` ports.
- **Volume Permissions**: Ensure the `uploads` directory has write permissions: `chmod -R 777 uploads`.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.