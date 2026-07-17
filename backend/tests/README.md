# Voice Karar Backend Testing Suite

This folder is designed to house test files.

## Planned Testing Types

1. **Unit Tests**
   - Location: `tests/unit/`
   - Testing business logic inside services (`auth.service.js`, `agreement.service.js`, etc.) with database calls mocked.

2. **Integration Tests**
   - Location: `tests/integration/`
   - Testing Express routes, middleware validation, pipeline logic, and DB transactions against a test database instance.

3. **Mocking External APIs**
   - Mocking the AI voice parsing integrations.

## Setup Instructions

In future stages, testing frameworks (e.g., Jest or Supertest) will be configured here. You will run tests using:
```bash
npm run test
```
