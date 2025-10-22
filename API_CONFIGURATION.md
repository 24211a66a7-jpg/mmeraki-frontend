# API Configuration Documentation

## ✅ Frontend API Configuration

### **Base URL Configuration**
- **Full API Base:** `https://mmeraki-backend1.vercel.app`
- **API Prefix:** Automatically adds `/api/` to all requests
- **Environment Variable:** `VITE_API_URL=https://mmeraki-backend1.vercel.app`

### **Authentication Headers**
- **Authorization Header:** `Authorization: Bearer <token>`
- **Token Source:** `localStorage.getItem('token')`
- **Automatic Injection:** Added to all requests when token exists

### **Request Configuration**
- **Credentials:** `credentials: 'include'` (for cookies)
- **Content-Type:** `application/json`
- **CORS:** Handled by backend CORS configuration

## 🔧 API Client Features

### **Automatic URL Building**
```typescript
// These all resolve to the same URL:
api.get('/auth/login')           // → https://mmeraki-backend1.vercel.app/api/auth/login
api.get('/api/auth/login')       // → https://mmeraki-backend1.vercel.app/api/auth/login
api.get('auth/login')            // → https://mmeraki-backend1.vercel.app/api/auth/login
```

### **Authentication Example**
```typescript
// Token is automatically added to headers
const response = await api.get('/auth/profile');
// Sends: Authorization: Bearer <token>
```

### **Request with Credentials**
```typescript
// All requests include credentials: 'include'
const response = await api.post('/auth/login', { email, password });
// Sends cookies and credentials
```

## 📋 Backend Requirements

### **CORS Configuration Required**
Your backend must include these CORS headers:
```
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### **API Endpoints Structure**
All endpoints should be prefixed with `/api/`:
- `GET /api/experiences`
- `POST /api/auth/login`
- `GET /api/wishlist`
- etc.

## 🚀 Usage Examples

### **Public Endpoints**
```typescript
// Get all experiences
const experiences = await api.get('/experiences');

// Get featured experiences
const featured = await api.get('/experiences/featured');

// Search experiences
const results = await api.get('/experiences/search', { q: 'romantic' });
```

### **Authenticated Endpoints**
```typescript
// Login (no auth required)
const loginResponse = await api.post('/auth/login', { email, password });

// Get user profile (auth required)
const profile = await api.get('/auth/profile');

// Add to wishlist (auth required)
await api.post('/wishlist', { experience_id: '123' });
```

### **Admin Endpoints**
```typescript
// Create experience (admin required)
await api.post('/experiences', experienceData);

// Update experience (admin required)
await api.put('/experiences/123', updateData);

// Delete experience (admin required)
await api.delete('/experiences/123');
```

## 🔍 Debugging

### **Check API Configuration**
```typescript
console.log('API Base URL:', api.baseUrl);
console.log('Current Token:', localStorage.getItem('token'));
```

### **Monitor Requests**
All requests are logged in the browser's Network tab with:
- Full URL
- Headers (including Authorization)
- Request body
- Response status

## ⚠️ Troubleshooting

### **CORS Errors**
If you see CORS errors, ensure your backend has proper CORS headers configured.

### **Authentication Errors**
- Check if token exists: `localStorage.getItem('token')`
- Verify token format: `Bearer <token>`
- Check if token is expired

### **Network Errors**
- Verify backend URL is correct
- Check if backend is running
- Verify network connectivity
