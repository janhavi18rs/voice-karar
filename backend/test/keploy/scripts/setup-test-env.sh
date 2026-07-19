#!/bin/bash

# test/keploy/scripts/setup-test-env.sh
# Set up test environment

set -e

echo "🔧 Setting up Keploy test environment"
echo "======================================"
echo ""

# Create .env.test
if [ ! -f .env.test ]; then
    echo "Creating .env.test..."
    cat > .env.test << 'EOF'
# Server Configuration
NODE_ENV=test
PORT=8080

# Database
MONGODB_URI=mongodb://localhost:27017/voice-karar-test

# JWT
JWT_SECRET=test-secret-key-do-not-use-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# API Configuration
LOG_LEVEL=info

# AI Service (optional, can be mocked)
AI_SERVICE_URL=http://localhost:5000
AI_SERVICE_TIMEOUT=30000
EOF
    echo "✓ Created .env.test"
else
    echo "✓ .env.test already exists"
fi

# Create directories if they don't exist
mkdir -p test/keploy/tests
mkdir -p test/keploy/mocks
mkdir -p test/fixtures

echo "✓ Created test directories"

# Check Node modules
if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "✅ Test environment is ready!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB: brew services start mongodb-community"
echo "2. Record tests:  npm run test:record"
echo "3. Run tests:     npm run test:run"
