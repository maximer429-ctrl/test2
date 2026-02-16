# Testing Documentation

## Test Coverage

Comprehensive tests have been created for the Angular application, covering authentication flows, protected routes, and components.

### Test Files Created

1. **auth.service.spec.ts** - Tests for authentication service
   - Login functionality with token storage
   - Registration with error handling
   - Logout and session management
   - Password reset flow (forgot password, verify token, reset password)
   - User retrieval from localStorage

2. **login.component.spec.ts** - Tests for login component
   - Form validation (username, password)
   - Successful login flow
   - Error handling for invalid credentials
   - Navigation to protected routes
   - UI state management (loading, errors)

3. **register.component.spec.ts** - Tests for registration component
   - Form validation (username, email, password, confirmPassword)
   - Password matching validation
   - Successful registration flow
   - Error handling (existing username, etc.)
   - Navigation after registration

4. **hello-world.component.spec.ts** - Tests for Hello World component
   - Component creation and rendering
   - Display of user information
   - Logout functionality
   - Protected route behavior

5. **auth.guard.spec.ts** - Tests for authentication guard
   - Allow access for authenticated users
   - Redirect to login for unauthenticated users
   - Authentication status checking

6. **forgot-password.component.spec.ts** - Tests for forgot password component
   - Email validation and submission
   - Success/error message display
   - API integration

7. **reset-password.component.spec.ts** - Tests for reset password component
   - Token verification from URL parameters
   - Password validation and matching
   - Successful password reset flow
   - Redirect to login after reset

## Running Tests

### ⚠️ Important: Tests Must Run in Containers

**This project uses Docker for all development. Do NOT install browsers or run tests on the host.**

### Run Tests in Container

```bash
# Run tests inside the frontend container
docker exec test2-frontend-1 npm test

# Run tests once (no watch mode)
docker exec test2-frontend-1 npm test -- --watch=false

# Run with coverage
docker exec test2-frontend-1 npm test -- --no-watch --code-coverage

# For headless execution, the container would need Chrome installed
# (Currently not set up - see prerequisites below)
```

### Prerequisites

Tests require a browser for execution. To run tests in headless mode, the frontend Dockerfile would need to be updated to include Chrome/Chromium:

```dockerfile
# Add to frontend/Dockerfile
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/
```

Then rebuild: `docker-compose up -d --build frontend`

### ~~Run Tests~~

~~```bash
cd frontend

# Run all tests (watch mode)
npm test

# Run tests once with coverage
npm test -- --no-watch --code-coverage

# Run in headless mode
npm test -- --browsers=ChromeHeadless --watch=false
```~~

**DO NOT run tests directly on host - use container commands above.**

### Test Framework

- **Framework**: Jasmine (test framework)
- **Runner**: Karma (test runner)
- **Browser**: Chrome/Chromium (headless mode available)

## Test Structure

Each test file follows Angular testing best practices:

1. **Setup**: Configure TestBed with necessary modules and mock dependencies
2. **Tests**: Cover functionality, edge cases, and error conditions
3. **Assertions**: Verify component behavior, service calls, and UI updates

## Coverage Areas

✅ **Authentication**
- Login flow with form validation
- Registration with email validation
- Token management and storage
- Protected route access

✅ **Password Reset**
- Forgot password request
- Token verification
- Password reset with validation
- Email-based workflow

✅ **Components**
- Hello World protected component
- User display and logout functionality

✅ **Guards**
- Auth guard for protected routes
- Redirect logic for unauthenticated access

## Next Steps

1. Install Chrome/Chromium for local test execution
2. Run tests regularly during development
3. Add E2E tests for complete user journeys
4. Integrate tests into CI/CD pipeline
5. Maintain test coverage as features are added
