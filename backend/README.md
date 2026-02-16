# Backend API

Node.js Express API with JWT authentication.

## Endpoints

### Authentication

- **POST /api/auth/login**
  - Login with username and password
  - Returns JWT token
  - Body: `{ "username": "string", "password": "string" }`

- **POST /api/auth/register**
  - Register a new user
  - Returns JWT token
  - Body: `{ "username": "string", "password": "string" }`

- **GET /api/auth/verify**
  - Verify JWT token
  - Requires Authorization header: `Bearer <token>`

### Other

- **GET /api/health**
  - Health check endpoint
  - Returns API status

- **GET /api/protected**
  - Example protected route
  - Requires Authorization header: `Bearer <token>`

## Running locally

```bash
npm install
npm start
```

Or with nodemon for development:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with:
```
PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Notes

- Current implementation uses in-memory storage
- For production, replace with a proper database
- Change JWT_SECRET in production
- Auto-creates users on first login (for demo purposes)
