@echo off
REM test/keploy/scripts/record-tests.bat
REM Windows helper script to record Keploy tests

setlocal enabledelayedexpansion

echo 🎬 Voice Karar Backend - Keploy Test Recording
echo ================================================
echo.

REM Check if .env.test exists
if not exist ".env.test" (
    echo ⚠️  .env.test not found. Creating from template...
    if exist ".env.test.template" (
        copy ".env.test.template" ".env.test"
        echo ✓ Created .env.test from template
    ) else (
        echo ❌ .env.test.template not found
        exit /b 1
    )
)

REM Check if Keploy is installed
where keploy >nul 2>nul
if errorlevel 1 (
    echo ❌ Keploy not installed or not in PATH
    echo.
    echo Install Keploy from: https://docs.keploy.io/docs/server/installation
    exit /b 1
)
echo ✓ Keploy is installed

echo.
echo Starting test recording...
echo Keploy is recording on http://localhost:8081
echo.
echo Use this curl command to test auth endpoint:
echo.
echo curl -X POST http://localhost:8081/api/v1/auth/register ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"SecurePass123!\", \"businessName\": \"Test Business\"}"
echo.
echo Press Ctrl+C to stop recording
echo.

REM Start Keploy recording
keploy record -c "npm run dev"

echo.
echo ✓ Test recording complete
echo Tests saved to: test\keploy\tests\
pause
