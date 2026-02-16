# Docker Setup

Multi-container Docker setup for Angular frontend and Node.js backend.

## Services

### Frontend (Angular)
- Port: 4200
- URL: http://localhost:4200
- Hot reload enabled with volume mounting

### Backend (Node.js API)
- Port: 3000
- URL: http://localhost:3000
- API endpoints: `/api/auth/login`, `/api/auth/register`, `/api/health`

### Legacy Webapp (Static HTML)
- Port: 8080
- Only runs with `--profile legacy`
- Original Hello World page

## Quick Start

Start all services:
```bash
docker-compose up -d
```

Start specific services:
```bash
docker-compose up -d frontend backend
```

View logs:
```bash
docker-compose logs -f
```

Stop services:
```bash
docker-compose down
```

Rebuild after changes:
```bash
docker-compose up -d --build
```

## Development

The setup includes volume mounting for hot reload:
- Frontend: `/frontend/src` is mounted for live Angular updates
- Backend: `/backend` is mounted (excluding `node_modules`)

Changes to source files will automatically trigger rebuilds.

## Environment Variables

Backend environment variables can be configured in `docker-compose.yml`:
- `PORT`: API server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   Angular App   │
│   Port: 4200    │
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
┌────────▼────────┐    ┌────────▼────────┐
│   Browser       │    │   Backend       │
│   User Access   │◄───┤   Node.js API   │
└─────────────────┘    │   Port: 3000    │
                       └─────────────────┘
```

## Notes

- First build may take several minutes to download images and install dependencies
- Subsequent builds use Docker layer caching for faster builds
- Use `docker-compose down -v` to remove volumes (will delete database data when added)
