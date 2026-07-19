@echo off
REM test/keploy/scripts/run-tests.bat
REM Windows helper script to run Keploy tests

setlocal enabledelayedexpansion

echo ▶️  Voice Karar Backend - Keploy Test Execution
echo ===============================================
echo.

REM Check if .env.test exists
if not exist ".env.test" (
    echo ❌ .env.test not found
    echo Please run record-tests.bat first to set up environment
    exit /b 1
)

REM Check if tests exist
if not exist "test\keploy\tests" (
    echo ❌ No test cases found in test\keploy\tests\
    echo Please run record-tests.bat first to record tests
    exit /b 1
)

echo ✓ Test environment ready

echo.
echo Running tests...
echo.

REM Run Keploy tests
keploy test -c "npm run dev" --delay 5

echo.
echo ✓ Test execution complete
pause
