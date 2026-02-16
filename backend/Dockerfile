# Backend Dockerfile for Node.js API
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose API port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
