# Hello World Webapp

A simple web application that displays "Hello World" in pink with a dinosaur pixel art image.

## Features

- Pink "Hello World" header
- Pixel art dinosaur illustration (SVG)
- Fully containerized development environment

## Development

This project uses Docker for development to keep your local machine clean.

### Prerequisites

- Docker
- Docker Compose

### Getting Started

1. **Start the webapp:**
   ```bash
   docker-compose up -d --build
   ```

2. **View the webapp:**
   Open your browser to http://localhost:8080

3. **Make changes:**
   Edit `index.html` - changes will be reflected immediately (no rebuild needed)

4. **Run tests:**
   ```bash
   ./test.sh
   ```

5. **Stop the webapp:**
   ```bash
   docker-compose down
   ```

### Project Structure

```
.
├── index.html          # Main webapp HTML file
├── Dockerfile          # Docker image definition
├── docker-compose.yml  # Docker Compose configuration
├── test.sh            # Test script
└── README.md          # This file
```

## Testing

Run the test suite to verify the webapp is working correctly:

```bash
./test.sh
```

The test checks for:
- Webapp is reachable
- "Hello World" text is present
- Pink color (#ff69b4) is used
- Dinosaur SVG element is present

## Technology Stack

- HTML5
- CSS3
- SVG for pixel art
- Nginx (Alpine) for serving content
- Docker & Docker Compose for containerization
