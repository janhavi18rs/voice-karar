# API Contracts

Outline of key API endpoints, request bodies, and response types.

## Authentication Module

### 1. Register User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
      "token": "JWT_TOKEN"
    }
  }
  ```

### 2. Login User
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
      "token": "JWT_TOKEN"
    }
  }
  ```

---

## Agreements Module

### 1. Create Agreement (From Voice Summary)
- **URL:** `/api/agreements`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "transcript": "Original audio transcript text here",
    "title": "Optional Agreement Title",
    "parties": [
      { "email": "john@abc.com", "name": "John", "role": "Buyer" }
    ]
  }
  ```

### 2. Get Agreement by Share ID
- **URL:** `/api/agreements/share/:shareId`
- **Method:** `GET`
- **Auth Required:** No (Public link access)

### 3. Update/Request Changes
- **URL:** `/api/agreements/:id`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "parameters": [
      { "key": "price", "value": "$12" }
    ],
    "requestRevision": true,
    "notes": "Change unit price from $15 to $12"
  }
  ```

---

## Confirmation Module

### 1. Accept/Confirm Agreement
- **URL:** `/api/confirmations/accept`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "shareId": "c8f9a2e3b1d749",
    "email": "john@abc.com",
    "signature": "John Doe"
  }
  ```
