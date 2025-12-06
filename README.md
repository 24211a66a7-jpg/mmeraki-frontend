# 🎉 mmeraki - Experience Booking Platform

A modern, full-stack experience booking platform where users can discover, book, and manage memorable experiences. Built with cutting-edge web technologies for optimal performance and user experience.

**Live Website:** [https://mmeraki.com/](https://mmeraki.com/)

---

## 📋 Table of Contents

- [About mmeraki](#about-mmeraki)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Features](#project-features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 🌟 About mmeraki

**mmeraki** is an innovative platform designed to connect users with unforgettable experiences. Whether you're looking to celebrate special occasions or explore new adventures, mmeraki makes it easy to discover, book, and manage experiences across various categories including birthdays, anniversaries, and more.

The platform provides a seamless experience with:
- Intuitive browsing and search capabilities
- Secure user authentication
- Shopping cart and wishlist management
- Real-time order processing
- Comprehensive admin dashboard for experience management

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI library for building interactive user interfaces |
| **TypeScript** | 5.8+ | Type-safe JavaScript for robust development |
| **Vite** | 5.4+ | Fast build tool and development server |
| **TailwindCSS** | 3.4+ | Utility-first CSS framework for styling |
| **Radix UI** | Latest | Headless UI component library |
| **React Router** | 6.30+ | Client-side routing and navigation |
| **TanStack Query** | 5.83+ | Server state management and data fetching |
| **Framer Motion** | 12.23+ | Animation library for smooth interactions |

**Deployment:** Hostinger (Production)

---

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Fastify** | 4.29+ | High-performance Node.js web framework |
| **TypeScript** | 5.3+ | Type-safe backend development |
| **Node.js** | 18+ | JavaScript runtime environment |
| **JWT (JSON Web Tokens)** | - | Secure user authentication |
| **bcrypt** | - | Password hashing and security |

**Deployment:** Vercel (Production)  
**API Base URL:** [https://mmeraki-backend1.vercel.app/](https://mmeraki-backend1.vercel.app/)

---

### Database

| Technology | Purpose |
|-----------|---------|
| **Supabase** | PostgreSQL-based backend-as-a-service platform |
| **PostgreSQL** | Relational database for data storage |

**Features:**
- Real-time database capabilities
- Built-in authentication (optional)
- Row-level security (RLS) policies
- RESTful API access
- Automatic backups and scalability

---

### Authentication

| Component | Technology | Details |
|-----------|-----------|---------|
| **Method** | JWT (JSON Web Tokens) | Stateless authentication |
| **Password Security** | bcrypt | Salted password hashing |
| **Session Storage** | Local Storage / Context API | Client-side token management |
| **Protected Routes** | React Router Guards | Component-level protection |
| **Admin Authentication** | Role-based Access Control | Separate admin login system |

---

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────┐
│          User Browser               │
└────────────────┬────────────────────┘
                 │
         ┌───────▼────────┐
         │  React SPA     │
         │  (Vite Built)  │
         └───────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐   ┌─────▼──┐   ┌────▼───┐
│Pages │   │ Components │ Context API
└──────┘   └────────┘   └────────┘
    │            │            │
    └────────────┼────────────┘
                 │
         ┌───────▼────────────┐
         │  API Calls (Fetch) │
         │  TanStack Query    │
         └───────┬────────────┘
                 │
         ┌───────▼────────────┐
         │   Backend API      │
         │   (Vercel)         │
         └────────────────────┘
```

### Backend Architecture

```
┌──────────────────────────────────────┐
│   Vercel (Production)                │
├──────────────────────────────────────┤
│  Fastify Server (Node.js)            │
├──────────────────────────────────────┤
│  Routes & Controllers                │
│  ├─ Auth Routes                      │
│  ├─ Experience Routes                │
│  ├─ Order Routes                     │
│  └─ Admin Routes                     │
├──────────────────────────────────────┤
│  Middleware                          │
│  ├─ JWT Verification                 │
│  ├─ Error Handling                   │
│  └─ CORS                             │
├──────────────────────────────────────┤
│  Database Layer (Supabase Client)    │
└──────────────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │ Supabase (Cloud) │
        │ ├─ PostgreSQL    │
        │ ├─ Auth          │
        │ └─ Storage       │
        └──────────────────┘
```

---

## 🚀 Deployment

### Frontend Deployment (Hostinger)

- **Live URL:** [https://mmeraki.com/](https://mmeraki.com/)
- **Hosting Provider:** Hostinger
- **Build Tool:** Vite
- **Build Output:** `/dist` directory
- **Deployment Strategy:** Automated via Hostinger

**Steps:**
1. Build the project: `npm run build`
2. Upload `/dist` folder to Hostinger hosting
3. Configure domain and DNS settings in Hostinger control panel

---

### Backend Deployment (Vercel)

- **API Base URL:** [https://mmeraki-backend1.vercel.app/](https://mmeraki-backend1.vercel.app/)
- **Hosting Provider:** Vercel
- **Framework:** Fastify (Node.js)
- **Deployment Strategy:** Automatic via Git push

**Steps:**
1. Create Vercel account and connect GitHub repository
2. Configure environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
3. Vercel automatically deploys on git push to main branch

---

### Database Deployment (Supabase)

- **Provider:** Supabase
- **Database:** PostgreSQL
- **Real-time:** Enabled
- **Region:** Based on Supabase project configuration

**Setup:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project and obtain API keys
3. Run database migrations
4. Set up Row Level Security (RLS) policies

---

## 📥 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9+) or **yarn** (v1.22+)
- **Bun** (recommended for faster package management) - [Download](https://bun.sh/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/studlyf-nirvaha/mmeraki-frontend.git
cd mmeraki-sparkle
```

### Step 2: Install Dependencies

**Option A: Using npm**
```bash
npm install
```

**Option B: Using Bun (Faster)**
```bash
bun install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Frontend Environment Variables
VITE_API_BASE_URL=https://mmeraki-backend1.vercel.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Backend Setup (Optional - For Local Development)

If developing with a local backend:

```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install

# Create .env file with Supabase credentials
cat > .env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
EOF

# Start backend server
npm run dev
```

**Get Supabase credentials:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project → Settings → API
3. Copy `Project URL` and `anon public key`

---

## ▶️ Running the Application

### Method 1: Frontend Only (Production Backend)

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Method 2: Full Stack (Local Development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Wait for message: `🚀 Server running on http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

Wait for message: `➜  Local:   http://localhost:5173/`

### Method 3: Using Setup Script (Recommended for First-Time Setup)

**Windows (PowerShell):**
```powershell
.\setup-dev.ps1
```

**Mac/Linux:**
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

### Available npm Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run backend       # Start backend server
npm run dev:all       # Start frontend + backend concurrently
```

---

## ✨ Project Features

### User Features
- ✅ **User Authentication** - Secure registration and login with JWT
- ✅ **Experience Browsing** - Search and filter experiences by category
- ✅ **Category Exploration** - Dedicated pages for birthdays, anniversaries, and more
- ✅ **Shopping Cart** - Add/remove items, manage quantities
- ✅ **Wishlist** - Save favorite experiences for later
- ✅ **Order Management** - Track bookings and past orders
- ✅ **User Profile** - Manage account details and preferences
- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **Location-Based Services** - Select delivery locations

### Admin Features
- ✅ **Admin Dashboard** - Central management hub
- ✅ **Experience Management** - Create, edit, delete experiences
- ✅ **Order Management** - View and manage all orders
- ✅ **User Management** - Manage platform users
- ✅ **Reports & Analytics** - Business insights and metrics
- ✅ **Event Management** - Create and manage featured events

---

## 📡 API Documentation

### Base URL
```
Production: https://mmeraki-backend1.vercel.app
Local Dev:  http://localhost:3001
```

### Authentication Endpoints

```bash
POST   /api/auth/register    # Create new account
POST   /api/auth/login       # User login
POST   /api/auth/logout      # User logout
POST   /api/auth/refresh     # Refresh JWT token
```

### Experience Endpoints

```bash
GET    /api/experiences      # Get all experiences
GET    /api/experiences/:id  # Get specific experience
POST   /api/experiences      # Create experience (Admin)
PUT    /api/experiences/:id  # Update experience (Admin)
DELETE /api/experiences/:id  # Delete experience (Admin)
```

### Order Endpoints

```bash
GET    /api/orders           # Get user's orders
POST   /api/orders           # Create new order
GET    /api/orders/:id       # Get order details
```

### User Endpoints

```bash
GET    /api/users/profile    # Get user profile
PUT    /api/users/profile    # Update profile
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Issue: Supabase connection fails

**Solution:**
1. Verify `.env` file has correct Supabase credentials
2. Check that your Supabase project is active
3. Ensure your IP is whitelisted in Supabase firewall
4. Test connection using Supabase dashboard

### Issue: Frontend cannot connect to backend

**Solution:**
1. Verify backend is running on correct port
2. Check `VITE_API_BASE_URL` environment variable
3. Ensure CORS is properly configured on backend
4. Check browser console for specific error messages

### Issue: Port already in use

**Solution:**
```bash
# Windows - Find and kill process on port 3001 or 5173
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Issue: ESLint errors

**Solution:**
```bash
npm run lint -- --fix
```

---

## 📞 Support & Contact

For issues, questions, or feature requests:
- 📧 Email: yashwanthmaram59@gmail.com 
- 🐙 GitHub: [GitHub Repository](https://github.com/24211a66a7-jpg/mmeraki-frontend.git)
- 🌐 Website: [mmeraki.com](https://mmeraki.com/)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Development Team

**mmeraki** is developed and maintained by yashwanth_maram

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

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

