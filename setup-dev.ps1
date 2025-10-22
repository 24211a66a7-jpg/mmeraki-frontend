# Development Environment Setup Script for mmeraki-sparkle (PowerShell)

Write-Host "🚀 Setting up mmeraki-sparkle development environment..." -ForegroundColor Cyan

function Print-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Print-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Print-Success "Node.js version: $nodeVersion"
} catch {
    Print-Error "Node.js is not installed. Please install Node.js >= 18"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Print-Success "npm version: $npmVersion"
} catch {
    Print-Error "npm is not installed"
    exit 1
}

# Create frontend .env if it doesn't exist
if (-not (Test-Path .env)) {
    if (Test-Path env.template) {
        Copy-Item env.template .env
        Print-Success "Created .env from template"
    } else {
        "VITE_API_URL=http://localhost:3001/api" | Out-File -FilePath .env -Encoding utf8
        Print-Success "Created .env with default configuration"
    }
} else {
    Print-Warning ".env already exists, skipping..."
}

# Create backend .env if it doesn't exist
if (-not (Test-Path backend\.env)) {
    if (Test-Path backend\env.template) {
        Copy-Item backend\env.template backend\.env
        Print-Warning "Created backend\.env from template - PLEASE EDIT IT WITH YOUR SUPABASE CREDENTIALS!"
    } else {
        @"
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
"@ | Out-File -FilePath backend\.env -Encoding utf8
        Print-Warning "Created backend\.env with template - PLEASE EDIT IT WITH YOUR SUPABASE CREDENTIALS!"
    }
} else {
    Print-Warning "backend\.env already exists, skipping..."
}

# Install frontend dependencies
Write-Host ""
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Print-Success "Frontend dependencies installed"
} else {
    Print-Error "Failed to install frontend dependencies"
    exit 1
}

# Install backend dependencies
Write-Host ""
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
Push-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Print-Success "Backend dependencies installed"
} else {
    Print-Error "Failed to install backend dependencies"
    Pop-Location
    exit 1
}
Pop-Location

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Print-Success "Setup completed successfully!"
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:"
Write-Host ""
Write-Host "1. Edit backend\.env with your Supabase credentials:" -ForegroundColor Yellow
Write-Host "   - Get them from https://app.supabase.com"
Write-Host ""
Write-Host "2. Start the backend server (Terminal 1):"
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Start the frontend server (Terminal 2):"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "4. Open http://localhost:8080 in your browser"
Write-Host ""
Write-Host "For more details, see SETUP_INSTRUCTIONS.md"
Write-Host ""

