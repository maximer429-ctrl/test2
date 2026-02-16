# Frontend Dockerfile for Angular development
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including Angular CLI
RUN npm install -g @angular/cli@17 && npm install

# Copy application files
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start dev server
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
