#!/bin/bash

# Development Environment Setup Script for mmeraki-sparkle

echo "🚀 Setting up mmeraki-sparkle development environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js >= 18"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be >= 18. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm version: $(npm -v)"

# Create frontend .env if it doesn't exist
if [ ! -f .env ]; then
    if [ -f env.template ]; then
        cp env.template .env
        print_success "Created .env from template"
    else
        echo "VITE_API_URL=http://localhost:3001/api" > .env
        print_success "Created .env with default configuration"
    fi
else
    print_warning ".env already exists, skipping..."
fi

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    if [ -f backend/env.template ]; then
        cp backend/env.template backend/.env
        print_warning "Created backend/.env from template - PLEASE EDIT IT WITH YOUR SUPABASE CREDENTIALS!"
    else
        cat > backend/.env << EOF
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
JWT_SECRET=dev-secret-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
BODY_LIMIT=1048576
EOF
        print_warning "Created backend/.env with template - PLEASE EDIT IT WITH YOUR SUPABASE CREDENTIALS!"
    fi
else
    print_warning "backend/.env already exists, skipping..."
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "=========================================="
print_success "Setup completed successfully!"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit backend/.env with your Supabase credentials:"
echo "   - Get them from https://app.supabase.com"
echo ""
echo "2. Start the backend server (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start the frontend server (Terminal 2):"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:8080 in your browser"
echo ""
echo "For more details, see SETUP_INSTRUCTIONS.md"
echo ""

