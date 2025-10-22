# 🎉 mmeraki-sparkle - Experience Booking Platform

A full-stack experience booking platform built with React, TypeScript, Fastify, and Supabase.

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Run Setup Script

**Windows (PowerShell):**
```powershell
.\setup-dev.ps1
```

**Mac/Linux:**
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

### 2️⃣ Configure Supabase

Edit `backend/.env` and add your credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

Get these from: [app.supabase.com](https://app.supabase.com) → Your Project → Settings → API

### 3️⃣ Start Backend

**Terminal 1:**
```bash
cd backend
npm run dev
```

Wait for: `🚀 Server running on http://0.0.0.0:3001`

### 4️⃣ Start Frontend

**Terminal 2:**
```bash
npm run dev
```

Wait for: `➜  Local:   http://localhost:8080/`

### 5️⃣ Open Browser

Go to: **http://localhost:8080** 🎉

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[START_HERE.md](./START_HERE.md)** | 👈 **READ THIS FIRST** - Step-by-step setup guide |
| [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) | Detailed setup & troubleshooting |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Current configuration & status |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Commands, API endpoints, tips |
| [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) | Recent changes & fixes |

---

## 🎯 Project Overview

### Tech Stack

**Frontend:**
- ⚛️ React 18.3
- 📘 TypeScript 5.8
- ⚡ Vite 5.4
- 🎨 TailwindCSS 3.4
- 🧩 Radix UI
- 🔄 React Router 6.30
- 🔍 TanStack Query

**Backend:**
- 🚀 Fastify 4.29
- 📘 TypeScript 5.3
- 🗄️ Supabase (PostgreSQL)
- 🔐 JWT Authentication
- 🔒 bcrypt for passwords

### Features

- ✅ User authentication (register, login, JWT)
- ✅ Experience browsing and search
- ✅ Shopping cart functionality
- ✅ Wishlist management
- ✅ Order processing
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Real-time updates

---

## 📦 Configuration

### Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 8080 | http://localhost:8080 |
| Backend | 3001 | http://localhost:3001 |

### Environment Variables

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend (`backend/.env`):**
```env
NODE_ENV=development
PORT=3001
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_key
JWT_SECRET=your_secret
```

---

## 🧪 Testing

### Test Backend Connection
```bash
node test-connection.js
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3001/health

# Get experiences
curl http://localhost:3001/api/experiences
```

---

## 📋 API Endpoints

### Public Endpoints
```
GET  /health                              - Health check
GET  /api/experiences                     - List experiences
GET  /api/experiences/:slug               - Get by slug
GET  /api/experiences/featured            - Featured items
GET  /api/experiences/category/:category  - By category
GET  /api/experiences/search?q=term       - Search
POST /api/seed                            - Seed database
POST /api/auth/register                   - Register user
POST /api/auth/login                      - Login user
```

### Protected Endpoints (Require Authorization Header)
```
GET    /api/auth/profile       - Get profile
PUT    /api/auth/profile       - Update profile
GET    /api/wishlist           - Get wishlist
POST   /api/wishlist           - Add to wishlist
DELETE /api/wishlist/:id       - Remove from wishlist
GET    /api/cart               - Get cart
POST   /api/cart               - Add to cart
PUT    /api/cart               - Update cart
DELETE /api/cart/:id           - Remove from cart
POST   /api/orders             - Create order
GET    /api/orders             - Get orders
```

---

## 📁 Project Structure

```
mmeraki-sparkle/
├── src/                        # Frontend source
│   ├── admin/                 # Admin pages
│   ├── components/            # React components
│   ├── context/               # React contexts
│   │   ├── AuthContext.tsx   # Authentication
│   │   ├── CartContext.tsx   # Shopping cart
│   │   └── WishlistContext.tsx
│   ├── lib/
│   │   └── api.ts            # API client ⭐
│   ├── pages/                # Page components
│   └── utils/                # Utilities
│
├── backend/                   # Backend source
│   ├── src/
│   │   ├── server.ts         # Main server ⭐
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utilities
│   └── database/             # SQL schemas
│
├── .env                       # Frontend config
├── backend/.env              # Backend config
├── setup-dev.ps1             # Windows setup
├── setup-dev.sh              # Mac/Linux setup
└── test-connection.js        # Connection test
```

---

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter
npm run test:connection  # Test backend connection
```

**Backend:**
```bash
cd backend
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm run start            # Start production server
npm run seed             # Seed database
```

---

## 🐛 Troubleshooting

### Backend won't start?
1. Check Supabase credentials in `backend/.env`
2. Verify port 3001 is not in use
3. Check Node.js version: `node -v` (should be >= 18)

### Frontend can't connect?
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `.env` has `VITE_API_URL=http://localhost:3001/api`
3. Restart frontend: `npm run dev`

### CORS errors?
1. Backend must be running on port 3001
2. Check CORS_ORIGINS in `backend/.env` includes `http://localhost:8080`
3. Clear browser cache

### More help?
- Run: `node test-connection.js`
- Read: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- Check: [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## 🚢 Production Deployment

### Backend (Vercel)
1. Create new Vercel project
2. Connect your repository
3. Set environment variables in Vercel dashboard
4. Deploy

### Frontend (Netlify/Vercel)
1. Update `.env`:
   ```env
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
2. Build: `npm run build`
3. Deploy the `dist` folder

---

## 🔒 Security

- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ CORS protection
- ✅ Rate limiting (100 req/min)
- ✅ Helmet security headers
- ⚠️ Change JWT_SECRET in production!
- ⚠️ Use HTTPS in production
- ⚠️ Keep Supabase service key secret

---

## 📝 License

MIT License

---

## 🆘 Need Help?

**📖 Documentation Order:**
1. [START_HERE.md](./START_HERE.md) - Quick start (read first!)
2. [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Detailed setup
3. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Commands & API
4. [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Configuration

**🧪 Test Connection:**
```bash
node test-connection.js
```

**💬 Check Status:**
- Backend health: http://localhost:3001/health
- Backend API docs: http://localhost:3001/
- Frontend: http://localhost:8080

---

## ✅ Status

- 🟢 **Backend**: Configured for port 3001
- 🟢 **Frontend**: Configured for port 8080
- 🟢 **API Connection**: Working
- 🟢 **TypeScript**: No errors
- 🟢 **Linter**: No errors
- 🟢 **Documentation**: Complete

**Ready for development!** 🎉

---

**Last Updated:** October 16, 2025  
**Version:** 1.0.0  

