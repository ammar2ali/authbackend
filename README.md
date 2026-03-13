# Auth Backend

Production-ready backend authentication system using Node.js, Express.js, and MongoDB following Clean Architecture.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables setup:
   Copy `.env.example` to `.env` and fill in the values for MongoDB URI and JWT secrets.

3. Run the application:
   ```bash
   npm run dev
   ```

## Folder Structure

This project follows Clean Architecture principles, ensuring separation of concerns:

```
src/
 ├── config/            # Environment and Database configuration
 │    └── db.js         # MongoDB connection setup
 │    └── env.js        # Environment variables loader
 │
 ├── controllers/       # Handles HTTP requests & responses
 │    └── auth.controller.js
 │
 ├── services/          # Core business logic (Registration, Login, etc.)
 │    └── auth.service.js
 │
 ├── models/            # Mongoose schemas representing database structure
 │    └── user.model.js
 │
 ├── routes/            # Express route definitions connecting endpoints to controllers
 │    └── auth.routes.js
 │
 ├── middleware/        # Express middlewares (Authentication & Error Handling)
 │    └── auth.middleware.js # Handles auto-refresh JWT logic
 │    └── error.middleware.js # Standardized error responses
 │
 ├── utils/             # Helper utilities and standard response formats
 │    └── generateTokens.js
 │    └── ApiError.js
 │    └── ApiResponse.js
 │
 ├── app.js             # Express application setup
 └── server.js          # App entrypoint & database connection execution
```

## Available APIs

| Method | Endpoint               | Description                               | Access       |
|--------|------------------------|-------------------------------------------|--------------|
| POST   | `/api/auth/register`   | Register a new user                       | Public       |
| POST   | `/api/auth/login`      | Log in and receive access/refresh tokens  | Public       |
| GET    | `/api/auth/profile`    | Get current user profile                  | Protected    |
| PUT    | `/api/auth/profile`    | Update user profile                       | Protected    |
| DELETE | `/api/auth/profile`    | Delete the user account                   | Protected    |
| POST   | `/api/auth/logout`     | Log out user (invalidates refresh token)  | Protected    |
