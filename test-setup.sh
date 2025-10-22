#!/bin/bash

# Setup Test Script for MMeraki Sparkle
# Tests if environment is configured correctly

set -e

echo "🧪 MMeraki Sparkle - Setup Test"
echo "==============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Test 1: Check backend .env exists
echo -n "1. Checking backend/.env exists... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Run: ./setup-env.sh"
    ((ERRORS++))
fi

# Test 2: Check frontend .env exists
echo -n "2. Checking .env exists... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Run: ./setup-env.sh"
    ((ERRORS++))
fi

# Test 3: Check if Supabase credentials are set
if [ -f "backend/.env" ]; then
    echo -n "3. Checking Supabase URL configured... "
    if grep -q "YOUR_SUPABASE_URL_HERE" backend/.env; then
        echo -e "${RED}✗${NC}"
        echo "   Edit backend/.env and add your SUPABASE_URL"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓${NC}"
    fi

    echo -n "4. Checking Supabase keys configured... "
    if grep -q "YOUR_SUPABASE.*_KEY_HERE" backend/.env; then
        echo -e "${RED}✗${NC}"
        echo "   Edit backend/.env and add your Supabase keys"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓${NC}"
    fi
fi

# Test 4: Check backend dependencies
echo -n "5. Checking backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "   Run: cd backend && npm install"
fi

# Test 5: Check frontend dependencies
echo -n "6. Checking frontend dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "   Run: npm install"
fi

# Test 6: Check if backend is running
echo -n "7. Checking backend is running... "
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    BACKEND_RESPONSE=$(curl -s http://localhost:3001/health)
    echo "   Status: $(echo $BACKEND_RESPONSE | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "   Backend not running. Start with: cd backend && npm run dev"
fi

# Test 7: Check if frontend is running
echo -n "8. Checking frontend is accessible... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "   Frontend not running. Start with: npm run dev"
fi

# Test 8: Test database connection
if [ -f "backend/.env" ] && ! grep -q "YOUR_SUPABASE" backend/.env; then
    echo -n "9. Testing database connection... "
    if curl -s http://localhost:3001/api/experiences > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "   Database connection failed. Check:"
        echo "   - Supabase credentials are correct"
        echo "   - Database tables are created"
        echo "   - Internet connection is working"
        ((ERRORS++))
    fi
fi

echo ""
echo "==============================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: cd backend && npm run dev"
    echo "2. Start frontend: npm run dev"
    echo "3. Open http://localhost:5173"
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    echo ""
    echo "Fix the errors above and run this test again"
    echo "For help, see: SETUP_AUTHENTICATION.md"
fi
echo ""

