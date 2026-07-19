#!/bin/bash

# test/keploy/scripts/record-tests.sh
# Helper script to record Keploy tests with proper setup

set -e

echo "🎬 Voice Karar Backend - Keploy Test Recording"
echo "================================================"
echo ""

# Check if .env.test exists
if [ ! -f .env.test ]; then
    echo "⚠️  .env.test not found. Creating from template..."
    cat > .env.test << EOF
NODE_ENV=test
PORT=8080
MONGODB_URI=mongodb://localhost:27017/voice-karar-test
JWT_SECRET=test-secret-key-do-not-use-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
EOF
    echo "✓ Created .env.test"
fi

# Check MongoDB
echo "Checking MongoDB connection..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "❌ MongoDB not running on localhost:27017"
    echo ""
    echo "Start MongoDB with one of these commands:"
    echo "  macOS:     brew services start mongodb-community"
    echo "  Docker:    docker run -d -p 27017:27017 mongo:latest"
    echo "  Manual:    mongod"
    exit 1
fi
echo "✓ MongoDB is running"

# Check if Keploy is installed
if ! command -v keploy &> /dev/null; then
    echo "❌ Keploy not installed"
    echo ""
    echo "Install Keploy with:"
    echo "  curl -O https://raw.githubusercontent.com/keploy/keploy/main/scripts/install.sh && source install.sh"
    exit 1
fi
echo "✓ Keploy is installed ($(keploy --version))"

echo ""
echo "Starting test recording..."
echo "Keploy is recording on http://localhost:8081"
echo ""
echo "Use this curl command to test auth endpoint:"
echo ""
echo 'curl -X POST http://localhost:8081/api/v1/auth/register \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"SecurePass123!\", \"businessName\": \"Test Business\"}'"
echo ""
echo "Press Ctrl+C to stop recording"
echo ""

# Start Keploy recording
keploy record -c "npm run dev"

echo ""
echo "✓ Test recording complete"
echo "Tests saved to: test/keploy/tests/"
