#!/bin/bash

# Environment Setup Script for MMeraki Sparkle
# This script creates the necessary .env files with template values

set -e

echo "🚀 MMeraki Sparkle - Environment Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files already exist
if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env already exists!${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping backend/.env"
        SKIP_BACKEND=true
    fi
fi

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env already exists!${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env"
        SKIP_FRONTEND=true
    fi
fi

# Create backend .env
if [ "$SKIP_BACKEND" != true ]; then
    echo "📝 Creating backend/.env..."
    cat > backend/.env << 'EOF'
# Backend Environment Variables
# IMPORTANT: Fill in your Supabase credentials below

# Server Configuration
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Supabase Configuration
# Get these from: https://app.supabase.com/project/_/settings/api
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_KEY_HERE

# JWT Configuration
JWT_SECRET=mmeraki-sparkle-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAILS=admin@mmeraki.com,admin@example.com
EOF
    echo -e "${GREEN}✅ Created backend/.env${NC}"
fi

# Create frontend .env
if [ "$SKIP_FRONTEND" != true ]; then
    echo "📝 Creating .env..."
    cat > .env << 'EOF'
# Frontend Environment Variables

# API Configuration
VITE_API_URL=http://localhost:3001

# Admin Configuration
# Comma-separated list of admin emails
VITE_ADMIN_EMAILS=admin@mmeraki.com,admin@example.com
EOF
    echo -e "${GREEN}✅ Created .env${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ Environment files created!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT NEXT STEPS:${NC}"
echo ""
echo "1. Edit backend/.env and add your Supabase credentials:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_KEY"
echo ""
echo "2. Get your credentials from:"
echo "   https://app.supabase.com/project/_/settings/api"
echo ""
echo "3. Setup your database tables:"
echo "   Run the SQL files in Supabase SQL Editor (in order):"
echo "   - backend/database/schema.sql"
echo "   - backend/database/user_schema_simple.sql"
echo "   - backend/database/wishlist_cart_schema.sql"
echo ""
echo "4. Install dependencies and start servers:"
echo "   cd backend && npm install && npm run dev"
echo "   # In another terminal:"
echo "   npm install && npm run dev"
echo ""
echo "5. Create your first admin user (see SETUP_AUTHENTICATION.md)"
echo ""
echo -e "${GREEN}📚 For detailed instructions, see: SETUP_AUTHENTICATION.md${NC}"
echo ""

