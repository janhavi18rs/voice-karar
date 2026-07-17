# API Documentation

Detailed descriptions of HTTP responses and errors.

## Standard Success Envelope
All responses return a JSON payload with a `success` flag.

```json
{
  "success": true,
  "message": "Information string description here",
  "data": {}
}
```

## Standard Error Envelope
All error responses use custom classes mapped to error middlewares.

```json
{
  "success": false,
  "message": "Error details descriptive message",
  "errors": [],
  "stack": "Stack trace (Only available in development environment)"
}
```

## Route Endpoints List

### Health Check
- `GET /api/health` -> Returns `200 OK` indicating server status.

### Authentication
- `POST /api/auth/register` -> Create a user profile.
- `POST /api/auth/login` -> Verify credentials and yield JWT token.

### Agreements
- `POST /api/agreements` -> Submit voice transcript to construct digital agreements.
- `GET /api/agreements` -> List agreements created by the user.
- `GET /api/agreements/:id` -> Fetch specific agreement (Auth required).
- `GET /api/agreements/share/:shareId` -> Retrieve public agreement data without login.
- `PATCH /api/agreements/:id` -> Request revisions or modify properties.

### Confirmations
- `POST /api/confirmations/accept` -> Confirm and accept agreement parameters.
