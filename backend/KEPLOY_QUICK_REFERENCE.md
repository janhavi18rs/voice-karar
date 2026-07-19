# Keploy Testing - Quick Reference Card

## 📋 Common Commands

### Setup
```bash
npm install                    # Install dependencies
cp .env.test.template .env.test # Create test config
```

### Recording & Execution
```bash
npm run test:record           # Start recording tests
npm test                      # Run all tests
npm run test:run              # Run all tests (explicit)
npm run test:record:no-proxy  # Record without proxy (troubleshoot)
```

### Cross-Platform Scripts
```bash
# macOS/Linux
bash test/keploy/scripts/record-tests.sh
bash test/keploy/scripts/run-tests.sh

# Windows
test\keploy\scripts\record-tests.bat
test\keploy\scripts\run-tests.bat
```

---

## 🎬 Recording Flow

1. **Start Recording**
   ```bash
   npm run test:record
   # Terminal shows: "Keploy recording on http://localhost:8081"
   ```

2. **Make API Calls** (in another terminal)
   ```bash
   # Example: Register user
   curl -X POST http://localhost:8081/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"Pass123!","businessName":"TestCorp"}'
   ```

3. **Stop Recording** (in recording terminal)
   ```bash
   Ctrl+C
   # Tests saved to: test/keploy/tests/
   ```

---

## ▶️ Execution Flow

```bash
npm test

# Output:
# ✓ POST /api/v1/auth/register
# ✓ POST /api/v1/auth/login
# ✓ GET /api/v1/dashboard
# ✓ POST /api/v1/agreements
# ...
# Tests Passed: 7/7 | Success Rate: 100%
```

---

## 🌐 API Endpoints Being Tested

### Auth (🔴 Critical)
- `POST /api/v1/auth/register` - Create user
- `POST /api/v1/auth/login` - Login user

### Dashboard (🔴 Critical)
- `GET /api/v1/dashboard` - Get user dashboard

### Agreements (🔴 Critical)
- `POST /api/v1/agreements` - Create agreement
- `GET /api/v1/agreements` - List agreements
- `PATCH /api/v1/agreements/:id` - Update agreement

### Confirmations (🔴 Critical)
- `POST /api/v1/confirmations/:token` - Submit confirmation

### Additional
- `GET /api/v1/agreements/share/:token` - Share link
- `GET /api/v1/confirmations/:token` - Get confirmation
- `DELETE /api/v1/agreements/:id` - Delete agreement

---

## ✅ Pre-Recording Checklist

- [ ] MongoDB running: `lsof -i :27017` (macOS) or `netstat -ano | findstr :27017` (Windows)
- [ ] Keploy installed: `keploy --version`
- [ ] Dependencies: `npm install`
- [ ] Environment: `.env.test` exists
- [ ] Port 8080 free: `lsof -i :8080` or `netstat -ano | findstr :8080`

---

## ✅ Test Recording Best Practices

1. **Record in logical groups**
   - Auth flow first (register → login)
   - Then agreement flow (create → update → list)
   - Finally confirmation flow

2. **Use realistic test data**
   - Valid emails and passwords
   - Proper date formats
   - Realistic agreement terms

3. **Test both success and failure**
   - Valid requests (200, 201 responses)
   - Invalid requests (400, 401, 404 responses)
   - Missing fields (400 responses)

4. **After recording**
   - Run tests: `npm test`
   - Should see ✓ for each endpoint
   - If failures, check logs and re-record

---

## 🔍 Test Files Location

After recording, tests appear in:
```
backend/test/keploy/tests/
├── POST-api-v1-auth-register.json
├── POST-api-v1-auth-login.json
├── GET-api-v1-dashboard.json
├── POST-api-v1-agreements.json
├── GET-api-v1-agreements.json
├── PATCH-api-v1-agreements-{id}.json
└── POST-api-v1-confirmations-{token}.json
```

Each file contains:
- Request (URL, method, headers, body)
- Expected response (status, body, headers)
- Timestamps (automatically ignored by Keploy)

---

## 🚨 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port 8080 in use | `lsof -ti:8080 \| xargs kill -9` |
| No MongoDB | `docker run -d -p 27017:27017 mongo:latest` |
| Keploy not found | `curl -O https://raw.githubusercontent.com/keploy/keploy/main/scripts/install.sh && source install.sh` |
| Tests fail | `npm run test:record` to re-record |
| Timestamp mismatch | Normal - Keploy handles this automatically |

---

## 📊 Expected Test Results

**First successful test run output:**

```
🎯 Keploy Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tests Executed:    7
Tests Passed:      7 ✓
Tests Failed:      0
Success Rate:      100%

Endpoint Summary:
✓ POST /api/v1/auth/register
✓ POST /api/v1/auth/login
✓ GET /api/v1/dashboard
✓ POST /api/v1/agreements
✓ GET /api/v1/agreements
✓ PATCH /api/v1/agreements/:id
✓ POST /api/v1/confirmations/:token

Total Duration: 2.3 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📚 Documentation Links

- **Full Guide**: `KEPLOY_GUIDE.md`
- **Integration Summary**: `KEPLOY_INTEGRATION_SUMMARY.md`
- **API Spec**: `test/keploy/API_TEST_SPEC.js`
- **Test Fixtures**: `test/fixtures/testData.js`

---

## ⏱️ Typical Time Breakdown

| Task | Time |
|------|------|
| First Keploy installation | 5 minutes |
| Environment setup (.env.test) | 2 minutes |
| Recording auth flow | 5 minutes |
| Recording agreement flow | 10 minutes |
| Recording confirmation flow | 5 minutes |
| First test run | 2-3 seconds |
| **Total first time** | **~30 minutes** |

---

## 🎯 Next Steps

1. Install Keploy: Follow `KEPLOY_GUIDE.md`
2. Set up environment: `cp .env.test.template .env.test`
3. Record tests: `npm run test:record`
4. Run tests: `npm test`
5. Add to CI/CD: See `KEPLOY_INTEGRATION_SUMMARY.md`

**Happy testing! 🚀**
