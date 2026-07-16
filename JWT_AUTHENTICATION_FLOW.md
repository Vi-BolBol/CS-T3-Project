# JWT Authentication Flow - Complete Implementation

## Authentication Flow Diagram

```
User enters email and password
              ↓ 
Frontend sends POST /api/auth/login
              ↓ 
Backend verifies email and password
              ↓ 
Backend generates JWT
              ↓ 
Frontend receives JWT
              ↓ 
Frontend stores JWT in localStorage
              ↓
Frontend sends JWT with protected requests
              ↓
Backend middleware verifies JWT
              ↓
Backend allows or rejects the request
```

## Implementation Details

### 1. Frontend Login Component
**File:** `Frontend/src/pages/auth/Login.auth.jsx`

- User enters credentials (email and password)
- Calls `loginUser()` from auth API
- On success:
  - Stores JWT token in `localStorage.setItem("token", result.token)`
  - Stores user data in `localStorage.setItem("user", JSON.stringify(result.user))`
  - Redirects based on user role (student → /user/home, company → /company/home)

### 2. Frontend API Layer
**File:** `Frontend/src/api/authApi.js`

**Functions:**
- `loginUser(loginData)` - POST /api/auth/login
- `registerUser(userData)` - POST /api/auth/register
- `getCurrentUser()` - GET /api/auth/me (requires JWT)

**File:** `Frontend/src/services/api.js`

- `apiRequest(endpoint, options)` - Generic API request function
- Automatically attaches JWT from localStorage to requests
- Handles 401 errors by clearing localStorage

### 3. Frontend Route Protection
**File:** `Frontend/src/components/ProtectRoute.jsx`

- Checks for JWT token in localStorage
- Redirects to /login if no token exists
- Renders child components if token is present

**File:** `Frontend/src/routes/App.route.jsx`

Protected routes wrapped with `<ProtectedRoute>`:
- `/company/*` - Company routes
- `/user/*` - User routes
- `/cv/*` - CV builder routes
- `/pipeline` - Pipeline view
- `/view-detail` - View detail page

### 4. Backend Authentication Service
**File:** `Backend/services/auth.service.js`

**Functions:**
- `registerService(payload)` - Creates new user with hashed password
- `loginService(payload)` - Verifies credentials and generates JWT
  - Uses bcrypt to compare passwords
  - Generates JWT with `jsonwebtoken`
  - JWT expires in 1 day
  - Returns token and user data

### 5. Backend Authentication Controller
**File:** `Backend/controllers/auth.controller.js`

**Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/me` - Get current user (protected)

### 6. Backend JWT Middleware
**File:** `Backend/middleware/auth.middleware.js`

**Function:** `protect(req, res, next)`

- Extracts JWT from Authorization header (Bearer token)
- Verifies JWT using `jsonwebtoken.verify()`
- Attaches decoded user data to `req.user`
- Returns 401 if token is missing or invalid
- Calls `next()` if token is valid

### 7. Backend Route Protection
**File:** `Backend/routes/auth.routes.js`

```javascript
router.get("/me", protect, getMe);
```

**File:** `Backend/routes/cv.routes.js`

All CV routes are protected:
```javascript
router.post("/generate-photo", protect, generatePhoto);
router.post("/score", protect, scoreCv);
router.post("/parse-upload", protect, parseUploadedCv);
```

### 8. Backend Configuration
**File:** `Backend/.env`

```env
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

**File:** `Backend/src/server.js`

- Express server configured with CORS
- JSON body parsing
- Routes mounted at `/api/auth` and `/api/cv`

## Testing the Flow

### 1. Start Backend Server
```bash
cd Backend
npm run dev
```

### 2. Start Frontend Server
```bash
cd Frontend
npm run dev
```

### 3. Test Login Flow
1. Navigate to `http://localhost:5173/login`
2. Enter email and password
3. Submit form
4. Verify JWT is stored in localStorage (F12 → Application → Local Storage)
5. Verify redirect to appropriate dashboard

### 4. Test Protected Routes
1. Try accessing `/user/home` without login → should redirect to `/login`
2. Login with valid credentials
3. Try accessing `/user/home` → should display page
4. Check Network tab to verify JWT is sent in Authorization header

### 5. Test API Requests
1. Open browser console
2. Run: `localStorage.getItem('token')` - should return JWT
3. Make API request with token:
```javascript
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

## Security Features

1. **Password Hashing**: bcrypt with salt rounds (10)
2. **JWT Expiration**: Tokens expire after 1 day
3. **HTTP-Only Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
4. **Protected Routes**: Both frontend and backend route protection
5. **Automatic Logout**: 401 responses clear localStorage
6. **CORS Configuration**: Backend configured with CORS

## Files Modified

### Frontend
- ✅ `Frontend/src/pages/auth/Login.auth.jsx` - Fixed duplicate code, proper JWT storage
- ✅ `Frontend/src/api/authApi.js` - Removed stray code, added getCurrentUser
- ✅ `Frontend/src/routes/App.route.jsx` - Added ProtectedRoute wrappers
- ✅ `Frontend/src/components/ProtectRoute.jsx` - Already implemented

### Backend
- ✅ `Backend/services/auth.service.js` - Removed duplicate function
- ✅ `Backend/controllers/auth.controller.js` - Added getMe endpoint
- ✅ `Backend/routes/auth.routes.js` - Added /me route with protect middleware
- ✅ `Backend/routes/cv.routes.js` - Protected all CV routes
- ✅ `Backend/middleware/auth.middleware.js` - Already implemented

## Next Steps

1. **Testing**: Test the complete flow with actual user credentials
2. **Token Refresh**: Implement refresh token mechanism
3. **Role-Based Access**: Add role checking middleware
4. **Password Reset**: Implement forgot password functionality
5. **Email Verification**: Add email verification on registration
6. **Production Security**: 
   - Use httpOnly cookies instead of localStorage
   - Implement CSRF protection
   - Add rate limiting
   - Use stronger JWT secret in production