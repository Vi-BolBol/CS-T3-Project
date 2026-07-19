# Frontend-Backend Connection Setup Guide

## Configuration Summary

Your frontend and backend are now configured to work together for login and registration functionality.

## Changes Made

### 1. Fixed Frontend Component Issues

#### Login.auth.jsx
- **Fixed**: Changed undefined variables `email` and `password` to `credentials.email` and `credentials.password`
- **Added**: Fallback error message for better user feedback

#### signup.auth.jsx
- **Fixed**: Changed undefined variables `name`, `email`, `password` to `formData.name`, `formData.email`, `formData.password`
- **Added**: Included `role` field in registration request (required by backend)

### 2. Enhanced API Configuration

#### authApi.js
- **Added**: HTTP error handling with try-catch blocks
- **Added**: Response validation to check `response.ok` status
- **Added**: User-friendly error messages for network errors
- **Improved**: Better error logging for debugging

### 3. Configured Vite Proxy

#### vite.config.js
- **Added**: Proxy configuration to forward `/api` requests to backend (port 3000)
- **Benefit**: Avoids CORS issues during development
- **Allows**: Frontend to use relative URLs instead of hardcoded localhost

### 4. Updated API URL

#### authApi.js
- **Changed**: From `http://localhost:3000/api/auth` to `/api/auth`
- **Benefit**: Works with Vite proxy in development, can be easily changed for production

## How to Run

### Prerequisites
1. Make sure PostgreSQL is running
2. Make sure backend dependencies are installed: `cd Backend && npm install`
3. Make sure frontend dependencies are installed: `cd Frontend && npm install`

### Start Backend Server
```bash
cd Backend
npm run dev
```
The backend should run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
The frontend should run on `http://localhost:5173` (or another port if 5173 is busy)

### Test the Application
1. Open browser to `http://localhost:5173`
2. Navigate to `/signup` to test registration
3. Navigate to `/login` to test login

## API Endpoints

### Register
- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "student" // or "company"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Register successful",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    }
  }
  ```

### Login
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    }
  }
  ```

## Backend Environment Variables

Located in `Backend/.env`:
- `PORT=3000` - Backend server port
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRES_IN=7d` - Token expiration time
- `CLIENT_URL=http://localhost:3000` - Frontend URL (for CORS if needed)

## Troubleshooting

### CORS Errors
- The Vite proxy should handle CORS in development
- If issues persist, ensure backend is running on port 3000

### Network Errors
- Check if backend server is running
- Verify PostgreSQL is running
- Check browser console for detailed error messages

### Login/Register Not Working
- Check browser DevTools Network tab to see actual API requests
- Check backend console for error logs
- Verify the request body matches expected format

## Production Deployment

When deploying to production:

1. **Update API_URL** in `Frontend/src/api/authApi.js`:
   ```javascript
   const API_URL = "https://your-backend-domain.com/api/auth";
   ```

2. **Update vite.config.js** - Remove or comment out the proxy configuration

3. **Update Backend CORS** in `Backend/src/server.js`:
   ```javascript
   app.use(cors({
     origin: "https://your-frontend-domain.com"
   }));
   ```

## Testing with Postman

Since you already tested with Postman, you can verify the frontend is working by:

1. Opening browser DevTools (F12)
2. Going to Network tab
3. Attempting login/register from the frontend
4. Checking that requests are sent to `/api/auth/login` or `/api/auth/register`
5. Verifying responses match expected format

## Next Steps

- Test registration flow
- Test login flow
- Verify token is stored in localStorage
- Implement protected routes using the stored token
- Add token refresh logic if needed