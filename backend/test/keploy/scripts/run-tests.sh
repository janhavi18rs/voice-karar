#!/bin/bash

# test/keploy/scripts/run-tests.sh
# Helper script to run Keploy tests

set -e

echo "▶️  Voice Karar Backend - Keploy Test Execution"
echo "==============================================="
echo ""

# Check if .env.test exists
if [ ! -f .env.test ]; then
    echo "❌ .env.test not found"
    echo "Please run record-tests.sh first to set up environment"
    exit 1
fi

# Check MongoDB
echo "Checking MongoDB connection..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "❌ MongoDB not running on localhost:27017"
    exit 1
fi
echo "✓ MongoDB is running"

# Check if tests exist
if [ ! -d test/keploy/tests ] || [ -z "$(ls -A test/keploy/tests)" ]; then
    echo "❌ No test cases found in test/keploy/tests/"
    echo "Please run record-tests.sh first to record tests"
    exit 1
fi
TEST_COUNT=$(ls test/keploy/tests/ | wc -l)
echo "✓ Found $TEST_COUNT test cases"

echo ""
echo "Running tests..."
echo ""

# Run Keploy tests
keploy test -c "npm run dev" --delay 5

echo ""
echo "✓ Test execution complete"
