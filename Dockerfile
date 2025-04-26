
FROM node:18-alpine

# Install FFmpeg and OpenSSL
RUN apk add --no-cache ffmpeg openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]