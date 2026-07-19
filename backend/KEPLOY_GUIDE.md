# Keploy Integration Guide - Voice Karar Backend

## Overview

**Keploy** is an open-source API testing and mocking tool that automatically records and replays HTTP interactions. It enables you to:

- 🎬 **Record** real API interactions as test cases
- ▶️ **Replay** tests without external dependencies
- 🚀 **Automate** API testing in CI/CD pipelines
- 🔍 **Mock** external services
- 📊 **Generate** test coverage reports

### Why Keploy for Voice Karar?

1. **No Code Changes Required** - Record tests from actual API usage
2. **Production-Ready** - Tests capture real-world scenarios
3. **Fast Execution** - Replayed tests run in milliseconds
4. **Dependency Management** - Mock MongoDB and external services
5. **CI/CD Integration** - Automated pre-deployment testing

---

## Installation

### Prerequisites

- Node.js 16+
- MongoDB (for testing)
- Keploy CLI

### Step 1: Install Keploy CLI

**macOS/Linux:**
```bash
curl -O https://raw.githubusercontent.com/keploy/keploy/main/scripts/install.sh && source install.sh
```

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/keploy/keploy/main/scripts/install.ps1 | iex
```

**Docker:**
```bash
docker run -it --rm -v $(pwd):/files keploy/keploy:latest
```

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

### Step 3: Verify Installation

```bash
keploy --version
```

---

## Configuration

### Environment Variables (`.env.test`)

Create `.env.test` in the backend root:

```env
# Server
NODE_ENV=test
PORT=8080

# Database (Test MongoDB instance)
MONGODB_URI=mongodb://localhost:27017/voice-karar-test

# JWT
JWT_SECRET=test-secret-key-do-not-use-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# AI Service (Mock or actual, depending on test scope)
AI_SERVICE_URL=http://localhost:5000
```

### Keploy Config (`keploy.config.json`)

The configuration file is already set up with:

- **Port**: 8080 (test server)
- **Test Directory**: `./test/keploy/tests`
- **Mock Directory**: `./test/keploy/mocks`
- **Timeout**: 30 seconds per request
- **Skip XPath**: Dynamic fields (timestamps, IDs)
- **Capture Headers**: Authorization, Content-Type, etc.

---

## Recording Tests

### Method 1: Interactive Recording (Recommended)

```bash
npm run test:record
```

This will:
1. Start your Express server in test mode
2. Launch Keploy in record mode
3. Accept incoming HTTP requests
4. Save test cases to `test/keploy/tests/`

**Steps:**
1. Run the command above
2. Make API calls using Postman, cURL, or your frontend
3. Press `Ctrl+C` when done
4. Tests are automatically saved

### Method 2: Recording Without Proxy

```bash
npm run test:record:no-proxy
```

Useful if you have connection issues with the proxy.

### Example: Recording Authentication Endpoint

**Terminal 1:**
```bash
npm run test:record
```

**Terminal 2 (cURL):**
```bash
# Register user
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "businessName": "Test Business"
  }'

# Login user
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

Or explicitly:

```bash
npm run test:run
```

This will:
1. Start your Express server
2. Replay all recorded test cases
3. Compare actual responses with recorded responses
4. Report pass/fail for each test

### Run Specific Test Suite

```bash
keploy test -c "npm run dev" --testName auth
```

### Output Example

```
✓ POST /api/v1/auth/register
✓ POST /api/v1/auth/login
✓ GET /api/v1/dashboard
✓ POST /api/v1/agreements
✓ PATCH /api/v1/agreements/:id
✓ POST /api/v1/confirmations
✓ GET /api/v1/confirmations/:shareToken

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tests Passed: 7/7
Success Rate: 100%
Total Duration: 2.3s
```

---

## API Endpoints Covered

### Authentication Routes

| Method | Endpoint | Recorded | Purpose |
|--------|----------|----------|---------|
| POST | `/api/v1/auth/register` | ✓ | User signup |
| POST | `/api/v1/auth/login` | ✓ | User login |

### Dashboard Routes

| Method | Endpoint | Recorded | Purpose |
|--------|----------|----------|---------|
| GET | `/api/v1/dashboard` | ✓ | Get user dashboard data |

### Agreement Routes

| Method | Endpoint | Recorded | Purpose |
|--------|----------|----------|---------|
| POST | `/api/v1/agreements` | ✓ | Create agreement |
| GET | `/api/v1/agreements` | ✓ | List agreements |
| PATCH | `/api/v1/agreements/:id` | ✓ | Update agreement |
| GET | `/api/v1/agreements/share/:token` | ✓ | Get agreement by share token |

### Confirmation Routes

| Method | Endpoint | Recorded | Purpose |
|--------|----------|----------|---------|
| GET | `/api/v1/confirmations/:shareToken` | ✓ | Get confirmation details |
| POST | `/api/v1/confirmations/:shareToken` | ✓ | Submit confirmation |

### AI Routes

| Method | Endpoint | Recorded | Purpose |
|--------|----------|----------|---------|
| POST | `/api/v1/ai/process` | ✓ | Process audio/text |

---

## Test Organization

```
backend/
├── test/
│   ├── fixtures/
│   │   ├── testData.js          # Test data and payloads
│   │   └── setupTeardown.js     # DB setup/cleanup
│   ├── keploy/
│   │   ├── tests/               # Generated test cases
│   │   │   ├── auth-register.yml
│   │   │   ├── auth-login.yml
│   │   │   ├── agreements-create.yml
│   │   │   ├── agreements-list.yml
│   │   │   ├── agreements-update.yml
│   │   │   ├── confirmations-get.yml
│   │   │   └── confirmations-submit.yml
│   │   └── mocks/               # Mock responses
│   │       └── external-services.yml
├── keploy.config.json           # Keploy configuration
└── .keployignore                # Ignore patterns
```

---

## Critical APIs for Deployment

These endpoints **MUST** pass all tests before deploying to production:

### 🔴 Critical - Block Deployment if Failed

1. **POST /api/v1/auth/register** - User creation is fundamental
2. **POST /api/v1/auth/login** - Authentication flow is essential
3. **GET /api/v1/dashboard** - User dashboard functionality
4. **POST /api/v1/agreements** - Agreement creation (core feature)
5. **GET /api/v1/agreements** - Agreement retrieval
6. **POST /api/v1/confirmations** - Buyer confirmation (revenue flow)

### 🟡 High Priority - Review if Failed

7. **PATCH /api/v1/agreements/:id** - Update functionality
8. **GET /api/v1/confirmations/:shareToken** - Share link access

### 🟢 Standard - Test if Time Permits

9. Health checks and utility endpoints

---

## Troubleshooting

### Issue: "Port already in use"

```bash
# Kill process on port 8080
# macOS/Linux:
lsof -ti:8080 | xargs kill -9

# Windows (PowerShell):
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: "MongoDB connection failed"

```bash
# Ensure MongoDB is running
# macOS:
brew services start mongodb-community

# Docker:
docker run -d -p 27017:27017 mongo:latest
```

### Issue: "Tests failing with timestamp mismatch"

This is expected. Keploy automatically skips dynamic fields. Check `.keployignore` is configured correctly.

### Issue: "JWT token invalid in replay"

Keploy stores JWT tokens from initial recording. For fresh recordings, always use `npm run test:record`.

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Keploy
        run: |
          curl -O https://raw.githubusercontent.com/keploy/keploy/main/scripts/install.sh
          source install.sh
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Run Keploy Tests
        run: cd backend && npm test
      
      - name: Report results
        if: failure()
        run: echo "API tests failed. Check the output above."
```

---

## Best Practices

### 1. **Separate Test Data**
- Use fixtures in `test/fixtures/testData.js`
- Never hardcode test data in tests
- Keep data realistic but minimal

### 2. **Regular Recording**
- Re-record tests after API changes
- Document why tests were updated
- Review changes before committing

### 3. **Environment Isolation**
- Use `.env.test` for test configuration
- Maintain separate test MongoDB database
- Mock external services (AI, payment, etc.)

### 4. **Version Control**
- Commit test cases to repository
- Track changes with git
- Review test updates in pull requests

### 5. **Pre-Deployment Checklist**
- [ ] All critical APIs pass
- [ ] New endpoints have recorded tests
- [ ] No flaky tests
- [ ] Coverage report reviewed
- [ ] Performance acceptable (< 5s for all tests)

---

## Advanced Features

### Mock External Services

Create `test/keploy/mocks/external-services.yml`:

```yaml
version: "1.1.0"
kind: "dns"
name: "mock-ai-service"
spec:
  address: "127.0.0.1:5000"
```

### Custom Headers

Edit `keploy.config.json` `captureHeader` array to include custom headers.

### Noise Reduction

For dynamic data, add to `skipXPath`:

```json
"skipXPath": [
  "**.timestamp",
  "**.id",
  "**.requestId",
  "**.nonce"
]
```

---

## Support & Resources

- **Keploy Docs**: https://docs.keploy.io
- **GitHub**: https://github.com/keploy/keploy
- **Discord**: https://discord.gg/uH3ynDtjJ8
- **API Reference**: Check `docs/api-documentation.md`

---

## Next Steps

1. ✅ Install Keploy CLI
2. ✅ Set up environment variables
3. ✅ Record authentication flows
4. ✅ Record agreement endpoints
5. ✅ Record confirmation flows
6. ✅ Verify all tests pass
7. ✅ Configure CI/CD
8. ✅ Add pre-deployment checks

Happy testing! 🚀
