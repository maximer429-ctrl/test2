# Full-Stack Authentication Application

A modern full-stack web application built with Angular and Node.js, featuring user authentication, password reset functionality, and protected routes. All development is containerized following the container-only development principle.

## Architecture

This project consists of three Docker services:

- **Frontend** (Angular 17): Modern single-page application on port 4200
- **Backend** (Node.js/Express): RESTful API server on port 3000
- **Legacy Webapp**: Simple "Hello World" page on port 8080

### Key Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Registration**: New users can create accounts with email and password
- **User Login**: Existing users authenticate to access protected routes
- **Password Reset Flow**: 
  - Request password reset via email
  - Verify token validity
  - Set new password with token
- **Route Protection**: Auth guard prevents unauthorized access to protected pages
- **Persistent Storage**: SQLite database with volume mounting for data persistence
- **Comprehensive Testing**: Unit tests for all services and components

## Technology Stack

### Frontend
- **Angular 17** with standalone components
- **TypeScript** for type-safe code
- **Jasmine/Karma** for unit testing
- **RxJS** for reactive programming
- **HttpClient** for API communication

### Backend
- **Node.js** with Express framework
- **JWT** (jsonwebtoken) for authentication tokens
- **bcryptjs** for password hashing
- **better-sqlite3** for database operations
- **SQLite** for persistent data storage
- **crypto** for secure token generation

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **Nginx** serving static frontend assets
- Volume mounts for database persistence and live development

## Prerequisites

- Docker
- Docker Compose
- Git (for version control)

## Getting Started

### 1. Start All Services

```bash
docker-compose up -d --build
```

This starts three services:
- **Frontend**: http://localhost:4200 (Angular application)
- **Backend**: http://localhost:3000 (API server)
- **Legacy**: http://localhost:8080 (Simple webapp)

### 2. Access the Application

Open your browser to http://localhost:4200

### 3. Using the Application

1. **Register**: Create a new account at `/register`
2. **Login**: Authenticate at `/login`
3. **Protected Route**: Access `/hello` (requires authentication)
4. **Password Reset**: 
   - Click "Forgot Password?" on login page
   - Enter email to receive reset token (currently logged to console)
   - Use token link to reset password

### 4. Stop Services

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## Project Structure

```
.
├── frontend/                # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/              # Login component
│   │   │   ├── register/           # Registration component
│   │   │   ├── hello-world/        # Protected page component
│   │   │   ├── forgot-password/    # Password reset request
│   │   │   ├── reset-password/     # Password reset form
│   │   │   ├── auth.service.ts     # Authentication service
│   │   │   ├── auth.guard.ts       # Route protection guard
│   │   │   ├── app.routes.ts       # Route configuration
│   │   │   └── **/*.spec.ts        # Unit tests
│   │   ├── index.html
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── backend/                 # Node.js API server
│   ├── server.js           # Express server and API endpoints
│   ├── db.js               # SQLite database operations
│   ├── data/               # Database volume mount
│   ├── Dockerfile
│   └── package.json
├── index.html              # Legacy webapp
├── docker-compose.yml      # Multi-container orchestration
├── DOCKER.md              # Container development guide
├── TESTING.md             # Testing documentation
└── AGENTS.md              # Development workflow guide
```

## API Documentation

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Password Reset Endpoints

#### Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "Password reset email sent",
  "token": "abc123..." // In production, this is sent via email
}
```

#### Verify Reset Token
```http
GET /api/auth/verify-reset-token/:token

Response: 200 OK
{
  "message": "Token is valid"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "newPassword": "newsecurepassword"
}

Response: 200 OK
{
  "message": "Password reset successfully"
}
```

## Development

### Core Principle: Container-Only Development

⚠️ **All development and testing must be done inside Docker containers.** See [DOCKER.md](DOCKER.md) for complete guidelines.

**Correct** (use containers):
```bash
docker-compose exec backend npm install <package>
docker-compose exec frontend ng generate component <name>
docker exec -it test2-frontend ng test
```

**Prohibited** (never on host):
```bash
npm install      # ❌ Don't install on host
ng generate      # ❌ Don't run Angular CLI on host
npm test         # ❌ Don't run tests on host
```

### Workflow with Beads

This project uses **bd (beads)** for issue tracking. See [AGENTS.md](AGENTS.md) for complete workflow.

**Quick reference:**
```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

**Important**: Always create a beads issue BEFORE writing code, even for small changes.

### Making Backend Changes

1. Create beads issue for your change
2. Modify code in `backend/`
3. Rebuild and restart backend container:
   ```bash
   docker-compose up -d --build backend
   ```
4. Test using curl or frontend
5. Commit with beads reference: `git commit -m "Closes test2-xxx: Description"`

### Making Frontend Changes

1. Create beads issue for your change
2. Modify code in `frontend/src/app/`
3. Rebuild and restart frontend container:
   ```bash
   docker-compose up -d --build frontend
   ```
4. Browser auto-reloads on http://localhost:4200
5. Commit with beads reference

### Viewing Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# All services
docker-compose logs -f
```

## Testing

This project has comprehensive unit tests for all Angular services and components. See [TESTING.md](TESTING.md) for complete testing guide.

**Note**: Tests require Chrome/Chromium in the Docker container. This is tracked in issue test2-o3v.

To run tests once Chrome is installed:
```bash
docker exec -it test2-frontend ng test --browsers=ChromeHeadless --watch=false
```

## Database

The backend uses SQLite with two main tables:

- **users**: Stores user accounts with hashed passwords
- **password_reset_tokens**: Stores password reset tokens with expiration

Database file: `backend/data/database.sqlite` (persisted via Docker volume)

### Accessing Database

```bash
docker-compose exec backend sqlite3 data/database.sqlite
```

Example queries:
```sql
-- View all users
SELECT id, email, created_at FROM users;

-- View active reset tokens
SELECT * FROM password_reset_tokens WHERE used = 0;
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Tokens expire and must be included in Authorization header
- **Token-Based Password Reset**: Crypto-generated tokens with expiration (1 hour)
- **No Auto-Creation**: Login requires existing account (must register first)
- **Route Protection**: AuthGuard prevents unauthorized access to protected routes
- **SQL Injection Protection**: Prepared statements in all database queries

## Future Improvements

See beads issues for tracked work:

- **test2-dvh**: Add email service for password reset (currently console logs)
- **test2-o3v**: Add Chrome to Docker for running tests
- **test2-wg6**: Set up automated test execution
- **test2-p7v**: Implement CI/CD pipeline
- **test2-38r**: Add E2E integration tests
- **test2-3r7**: Enforce code coverage thresholds

## License

[Your License Here]

## Contributing

1. Create beads issue for your change: `bd create "Title" --type task`
2. Update issue to in_progress: `bd update <id> --status in_progress`
3. Make changes following container-only principle
4. Write tests for new functionality
5. Commit with beads reference: `git commit -m "Closes test2-xxx: Description"`
6. Push to remote: `git push`
7. Run `bd sync` to update issue tracking
